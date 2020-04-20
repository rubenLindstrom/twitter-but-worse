const functions = require("firebase-functions");
const app = require("express")();
const auth = require("./util/auth");
const { db } = require("./util/admin");

const {
  getAllPosts,
  createPost,
  getPost,
  commentOnPost,
  toggleApprovePost,
  deletePost,
  getComments,
  deleteComment
} = require("./handlers/posts");
const {
  signUp,
  logIn,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser,
  getUserDetails,
  markNotificationsRead
} = require("./handlers/users");

// == POSTS
app.get("/posts", getAllPosts);
app.get("/post/:postId", getPost);
app.get("/post/:postId/comments", getComments);
app.post("/post", auth, createPost);
app.post("/post/:postId/comment", auth, commentOnPost);
app.post("/post/:postId/approve", auth, toggleApprovePost);
app.delete("/post/:postId", auth, deletePost);
app.delete("/comment/:commentId", auth, deleteComment);
// TODO: Delete comment --> Create Trigger to delete notifications related to comment

// ==  USERS
app.post("/signup", signUp);
app.post("/login", logIn);
app.post("/user/image", auth, uploadImage);
app.patch("/user", auth, addUserDetails);
app.get("/user", auth, getAuthenticatedUser);
app.get("/user/:handle", getUserDetails);
app.post("/notifications", auth, markNotificationsRead);

// Expose:ar alla våra app-ruotes på "api" underdomänet
exports.api = functions.region("europe-west2").https.onRequest(app);

const createNotificationFunction = type => {
  return functions
    .region("europe-west2")
    .firestore.document(`${type}s/{id}`)
    .onCreate(snapshot => {
      return db
        .doc(`/posts/${snapshot.data().postId}`)
        .get()
        .then(doc => {
          if (
            doc.exists &&
            doc.data().userHandle !== snapshot.data().userHandle
          ) {
            return db.doc(`notifications/${snapshot.id}`).set({
              createdAt: new Date().toISOString(),
              recipient: doc.data().userHandle,
              sender: snapshot.data().userHandle,
              type,
              read: false,
              postId: doc.id
            });
          }
        })
        .catch(err => {
          console.error(error);
        });
    });
};

exports.createNotificationOnApprove = createNotificationFunction("approve");
exports.createNotificationOnComment = createNotificationFunction("comment");
exports.deleteNotificationOnDisapprove = functions
  .region("europe-west2")
  .firestore.document("approves/{id}")
  .onDelete(snapshot => {
    return db
      .doc(`/notifications/${snapshot.id}`)
      .delete()
      .catch(err => {
        console.error(err);
      });
  });

exports.onUserImageChange = functions
  .region("europe-west2")
  .firestore.document("/users/{userId}")
  .onUpdate(change => {
    if (change.before.data().imageUrl !== change.after.data().imageUrl) {
      console.log("Image has changed");

      const batch = db.batch();
      return db
        .collection("posts")
        .where("userHandle", "==", change.before.data().handle)
        .get()
        .then(data => {
          data.forEach(doc => {
            const post = db.doc(`posts/${doc.id}`);
            batch.update(post, { userImage: change.after.data().imageUrl });
          });
          return batch.commit();
        });
    } else {
      return true;
    }
  });

exports.onPostDeleted = functions
  .region("europe-west2")
  .firestore.document("/posts/{postId}")
  .onDelete((snapshot, context) => {
    const postId = context.params.postId;
    const batch = db.batch();
    return db
      .collection("comments")
      .where("postId", "==", postId)
      .get()
      .then(data => {
        data.forEach(doc => batch.delete(db.doc(`/comments/${doc.id}`)));
        return db
          .collection("approves")
          .where("postId", "==", postId)
          .get();
      })
      .then(data => {
        data.forEach(doc => batch.delete(db.doc(`/approves/${doc.id}`)));
        return db
          .collection("notifications")
          .where("postId", "==", postId)
          .get();
      })
      .then(data => {
        data.forEach(doc => batch.delete(db.doc(`/notifications/${doc.id}`)));
        return batch.commit();
      })
      .catch(err => {
        console.error(err);
      });
  });
