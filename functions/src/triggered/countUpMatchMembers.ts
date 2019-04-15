import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Type import
import DocumentData = admin.firestore.DocumentData;
import DocumentSnapshot = admin.firestore.DocumentSnapshot;
import DocumentReference = admin.firestore.DocumentReference;
import Firestore = admin.firestore.Firestore;
import WriteResult = admin.firestore.WriteResult;

function countUpMatchMembersWithEachOther(db: Firestore, members: DocumentData[]): Promise<WriteResult[]> {
  const batch = db.batch();

  members.forEach((user) => {
    console.info(`user: `);
    console.info(user);

    let matchCount = user.matchCount || {};
    const otherMembers = members.filter(x => x != user);

    // increment matchCount
    otherMembers.forEach( user =>{
      const current: number = matchCount[user.uid] || 0;
      matchCount[user.uid] = current + 1;
    });

    console.info(`matchCount: `);
    console.info(matchCount);
    batch.update(db.collection(`users`).doc(user.uid), { matchCount });
  });

  return batch.commit();
}

/**
 * メインロジック
 * @param entry
 */
async function main(entry: DocumentSnapshot) {
  const db = admin.firestore();

  const matchingGroupsRef: DocumentReference[] = entry.get("groups");
  const matchingGroups = await Promise.all(matchingGroupsRef.map((matchingGroup) => {
    return matchingGroup.get();
  }));

  const membersPerGroups = await Promise.all(matchingGroups.map((group) => {
    const membersRefs: DocumentReference[] = group.get("members");
    return Promise.all(membersRefs.map((members => members.get())));
  }));

  const result = await Promise.all(membersPerGroups.map((membersSnap) => {
    // @ts-ignore
    const members: DocumentData[] = membersSnap.map((user) => user.data()).filter(x => x != undefined);
    console.info(`members: `);
    console.info(members);

    return countUpMatchMembersWithEachOther(db, members);
  }));

  console.info(`result: `);
  console.info(result);

  return result;
}

/**
 * Function Handler
 */
export const countUpMatchMembersOnEntryProceeded = functions.firestore
  .document('entries/{id}').onUpdate((change, context) => {
    console.info(`context: `);
    console.info(context);

    const { before, after } = change;
    console.info(`before: `);
    console.info(before);
    console.info(`after: `);
    console.info(after);
    if (!(before && after)) return;

    const beforeState: string[] = before.get("state");
    const afterState: string[] = after.get("state");
    if (beforeState.includes("PROCESSED") || !beforeState.includes("UNPROCESSED")
      || afterState.includes("UNPROCESSED") || !afterState.includes("PROCESSED")) {
      return;
    }

    return main(after);
  });
