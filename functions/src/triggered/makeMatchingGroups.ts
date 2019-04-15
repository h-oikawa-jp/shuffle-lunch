import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as R from 'ramda';

// Type import
import DocumentData = admin.firestore.DocumentData;
import DocumentSnapshot = admin.firestore.DocumentSnapshot;
import DocumentReference = admin.firestore.DocumentReference;
import Firestore = admin.firestore.Firestore;
import WriteResult = admin.firestore.WriteResult;

function putMatchingGroups(db: Firestore, entry: DocumentSnapshot, matchingGroups: DocumentReference[][]): Promise<WriteResult[]> {
  const batch = db.batch();

  const groupsRefs = matchingGroups.map((group, index) => {
    const groupsRef = db.collection("matchingGroups").doc();
    batch.set(groupsRef, {
      entryId: entry.id,
      groupNumber: index + 1,
      members: group
    });
    return groupsRef;
  });

  batch.update(db.collection(`entries`).doc(entry.id), {
    groups: groupsRefs,
    state: ["PROCESSED"]
  });

  const postId = entry.get("postId");
  if (postId) {
    batch.update(db.collection(`posts`).doc(postId), {
      lastEntryId: entry.id
    });
  }

  return batch.commit();
}

/**
 * ユーザリストを指定人数ごとにグルーピングした2次元配列を返す。
 * 極力過去にマッチングした回数が少ない相手との組み合わせを優先する。
 * @param userRefs ユーザリスト
 * @param divideLength 何人ずつに分けるか
 */
async function makeGroups(userRefs: DocumentReference[], divideLength: number): Promise<DocumentReference[][]> {
  // 生成する合計グループ数
  const groupNum = Math.ceil(userRefs.length / divideLength);
  // 組み合わせグループ／メンバーリストを格納する二次元表
  const groupedTable: DocumentData[][] = R.range(0, groupNum).map(() => []);

  // Firestoreからユーザデータを取得
  const snaps = await Promise.all(userRefs.map(user => user.get()));
  const nonnull: DocumentData[] = R.filter(x => x != undefined, snaps.map(snap => snap.data()));

  // ユーザのmatchCountのトータル(過去の参加数)が多い順にソート
  const sorted: DocumentData[] = R.sortBy(data => {
    return data.matchCount ? - R.sum(R.values(data.matchCount)) : 0;
  }, nonnull);

  // ユーザごとに順次組み合わせ表に格納
  sorted.forEach((user) => {
    const emptyGroup = groupedTable.find(R.isEmpty);
    if (emptyGroup) {
      // まだメンバーが空のグループが残っている場合は優先的に選択
      emptyGroup.push(user);

    } else {
      // まだ空きがあるグループの中からメンバーを追加するグループを選択する

      // 追加対象グループの一時記憶用変数
      let targetGroupInfo: { group: DocumentData, totalMatchCount: number } = {
        // @ts-ignore 以下のループで必ず一度は再代入される想定 (空きグループが一つもない = グループ数/フィルタ条件などが間違っている)
        group: null,
        totalMatchCount: Number.POSITIVE_INFINITY
      };

      // 既に満席のグループを除外してループ
      const vacantGroups = groupedTable.filter(group => group.length < divideLength);
      vacantGroups.forEach(group => {
        // 現在のグループのメンバーと処理中のユーザが過去にマッチングした回数の合計値を算出
        const membersUids = group.map(x => x.uid);
        const totalMatchCount = R.sum(membersUids.map(uid => {
          return R.propOr(0, uid)(user.matchCount);
        }));

        // 選択済みグループより上記合計値が少なければ追加対象をスイッチ
        if (totalMatchCount < targetGroupInfo.totalMatchCount) {
          targetGroupInfo = { group, totalMatchCount }
        }
      });

      // 選択グループへメンバーを追加
      targetGroupInfo.group.push(user);
    }
  });

  console.info(`groupedTable`);
  console.info(groupedTable);

  // 組み合わせ表のデータをDocumentReference(Firestoreの参照)型にマッピングして返却
  return groupedTable.map(group => group.map(user => {
    // @ts-ignore 元のユーザリストから見つからず undefined となる事はない想定
    const userRef: DocumentReference = R.find(ref => user.uid === ref.id, userRefs);
    return userRef;
  }));
}

/**
 * メインロジック
 * @param entry
 */
async function main(entry: DocumentSnapshot) {
  const db = admin.firestore();

  const entryUsers: DocumentReference[] = entry.get("entryUsers");
  const groupCapacity: number = entry.get("groupCapacity");

  const matchingGroups = await makeGroups(entryUsers, groupCapacity);
  const result = await putMatchingGroups(db, entry, matchingGroups);

  console.info(`result: `);
  console.info(result);

  return result;
}

/**
 * Function Handler
 */
export const makeMatchingGroupsOnEntryCreated = functions.firestore
  .document('entries/{id}').onCreate((snap, context) => {
    console.info(`context: `);
    console.info(context);
    console.info(`snap: `);
    console.info(snap);

    return main(snap);
  });
