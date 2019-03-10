import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();

// Type import
import DocumentSnapshot = admin.firestore.DocumentSnapshot;
import Firestore = admin.firestore.Firestore;
import WriteResult = admin.firestore.WriteResult;

function getUsers(db: Firestore): Promise<DocumentSnapshot[]> {
  return db.collection('users').get()
    .then((querySnapshot) => querySnapshot.docs);
}

function putShufflesToPost(db: Firestore, id: string, shuffles: DocumentSnapshot[][]): Promise<WriteResult> {
  let userReferencePairs = {};
  shuffles.forEach((pairs, idx) =>
    userReferencePairs = Object.assign(userReferencePairs, {
      // key = index, value = マッチしたユーザ配列 (users への reference タイプとして登録する)
      [idx + 1]: pairs.map(user => user.ref)
    })
  );

  return db.collection(`posts`).doc(id).update({
    shuffles: userReferencePairs
  });
}

/**
 * ユーザリストをシャッフルして指定人数ごとに分割した2次元配列を返す
 * @param users ユーザリスト
 * @param divideLength 何人ずつに分けるか
 */
function shuffleUsers(users: DocumentSnapshot[], divideLength: number): DocumentSnapshot[][] {
  // Fisher–Yates shuffle
  for(let i = users.length - 1; i > 0; i--){
    const r = Math.floor(Math.random() * (i + 1));
    const tmp = users[i];
    users[i] = users[r];
    users[r] = tmp;
  }

  return users.reduce((table: DocumentSnapshot[][], uid: DocumentSnapshot) => {
    const last = table[table.length - 1];
    if (last.length === divideLength) {
      table.push([uid]);
    } else {
      last.push(uid);
    }
    return table;
  }, [[]]);
}

/**
 * メインロジック
 * @param postId 対象イベントの Post ID
 */
async function main(postId: string) {
  const db = admin.firestore();

  const users = await getUsers(db);
  console.info(`users: ${JSON.stringify(users.map(x => x.id))}`);
  const shuffleUids = shuffleUsers(users, 2);

  return await putShufflesToPost(db, postId, shuffleUids);
}

/**
 * Function Handler
 */
export const shuffle = functions.https.onRequest((request, response) => {
  const matches = request.path.match(/.*\/shuffle\/([^\/]+).*/i);
  console.info(matches);
  if (!matches) return response.status(404).send("URI error");

  return main(matches[1])
    .then((res) => {
      return response.status(200).send(res);
    }).catch((err) => {
      return response.status(500).send(err.toString());
    });
});
