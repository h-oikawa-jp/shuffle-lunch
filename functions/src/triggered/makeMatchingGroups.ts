import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Type import
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
 * ユーザリストを指定人数ごとに分割した2次元配列を返す
 * @param users ユーザリスト
 * @param divideLength 何人ずつに分けるか
 */
function makeGroups(users: DocumentReference[], divideLength: number): DocumentReference[][] {
  return users.reduce((table: DocumentReference[][], user: DocumentReference) => {
    const last = table[table.length - 1];
    if (last.length === divideLength) {
      table.push([user]);
    } else {
      last.push(user);
    }
    return table;
  }, [[]]);
}

/**
 * メインロジック
 * @param entry
 */
async function main(entry: DocumentSnapshot) {
  const db = admin.firestore();

  const entryUsers: DocumentReference[] = entry.get("entryUsers");
  console.info(`entryUsers: `);
  console.info(entryUsers);
  const groupCapacity: number = entry.get("groupCapacity");
  console.info(`groupCapacity: `);
  console.info(groupCapacity);

  const matchingGroups = makeGroups(entryUsers, groupCapacity);
  console.info(`matchingGroups: `);
  console.info(matchingGroups);

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
