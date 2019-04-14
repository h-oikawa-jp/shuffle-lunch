import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Type import
import DocumentSnapshot = admin.firestore.DocumentSnapshot;
import DocumentReference = admin.firestore.DocumentReference;
import Firestore = admin.firestore.Firestore;
import WriteResult = admin.firestore.WriteResult;

function getPost(db: Firestore, id: string): Promise<DocumentSnapshot> {
  return db.collection('posts').doc(id).get()
    .then((querySnapshot) => {
      if (!querySnapshot.exists) throw new URIError(`post [${id}] is not found`);
      const state: string[] = querySnapshot.get("state");
      if (state.includes("DELETED")) throw new URIError(`post [${id}] is DELETED`);
      return querySnapshot
    });
}

function getUsers(db: Firestore): Promise<DocumentSnapshot[]> {
  return db.collection('users').get()
    .then((querySnapshot) => querySnapshot.docs);
}

function putEntry(db: Firestore, post: DocumentReference, entryUsers: DocumentReference[], groupCapacity: number): Promise<WriteResult> {
  return db.collection(`entries`).doc().set({
    postId: post.id,
    groupCapacity,
    entryUsers,
    state: ["UNPROCESSED"]
  });
}

/**
 * メインロジック
 * @param postId 対象イベントの Post ID
 * @param maxNum 1グループの最大人数
 */
async function main(postId: string, maxNum: number) {
  const db = admin.firestore();

  const post = await getPost(db, postId);
  const users = await getUsers(db);
  console.info(`users: ${JSON.stringify(users.map(x => x.id))}`);

  return await putEntry(db, post.ref, users.map(x => x.ref), maxNum);
}

/**
 * Function Handler
 */
export const shuffleEntry = functions.https.onRequest((request, response) => {
  console.info(request.url);
  const pathMatches = request.path.match(/.*\/shuffleEntry\/([^\/]+).*/i);
  console.info("pathMatches: ");
  console.info(pathMatches);
  if (!pathMatches) return response.status(404).send("URI error");

  const maxNum = parseInt(request.query['maxNum'], 10);

  return main(pathMatches[1], maxNum || 2)
    .then((res) => {
      return response.status(200).send(res);
    }).catch((err) => {
      if (err instanceof URIError) {
        return response.status(404).send(err.toString());
      }
      return response.status(500).send(err.toString());
    });
});
