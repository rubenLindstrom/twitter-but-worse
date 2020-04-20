const { db } = require("../util/admin");
const { isEmpty } = require("../util/validators");

// TODO: Consider adding limit
exports.getAllPosts = (req, res) => {
  db.collection("posts")
    .orderBy("createdAt", "desc")
    .get()
    .then(data => {
      const posts = {};
      data.forEach(doc => (posts[doc.id] = doc.data()));
      return res.json(posts);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

exports.createPost = (req, res) => {
  const body = req.body.body;
  const userHandle = req.user.handle;

  if (isEmpty(body)) return res.status(400).json({ body: "Must not be empty" });

  const newPost = {
    body,
    userHandle,
    userImage: req.user.imageUrl,
    createdAt: new Date().toISOString(),
    approveCount: 0,
    commentCount: 0,
    commentIds: []
  };

  db.collection("posts")
    .add(newPost)
    .then(post => {
      db.doc(`/users/${userHandle}`)
        .get()
        .then(user => {
          const posts = user.data().posts;
          posts.unshift(post.id);
          user.ref
            .update({ posts })
            .then(() => res.json({ post: newPost, id: post.id }))
            .catch(err => {
              console.error(err);
              return res.status(500).json({ error: "Something went wrong" });
            });
        })
        .catch(err => {
          console.error(err);
          return res.status(500).json({ error: "Something went wrong" });
        });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: "Something went wrong" });
    });
};

exports.getPost = (req, res) => {
  let postData = {};
  // TODO: Validate param

  db.doc(`posts/${req.params.postId}`)
    .get()
    .then(doc => {
      if (!doc.exists) return res.status(404).json({ error: "Post not found" });
      else {
        postData = doc.data();
        const docRefs = postData.commentIds.map(id =>
          db.doc(`/comments/${id}`)
        );
        if (docRefs.length === 0) return [];
        return db.getAll(...docRefs);
      }
    })
    .then(docs => {
      postData.comments = docs.map(doc => ({ ...doc.data(), id: doc.id }));
      return res.json(postData);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

exports.getComments = (req, res) => {
  db.doc(`posts/${req.params.postId}`)
    .get()
    .then(doc => {
      if (!doc.exists) return res.status(404).json({ error: "Post not found" });
      else {
        postData = doc.data();
        postData.id = doc.id;
        const docRefs = postData.commentIds.map(id =>
          db.doc(`/comments/${id}`)
        );
        if (docRefs.length === 0) return [];
        return db.getAll(...docRefs);
      }
    })
    .then(docs => {
      comments = docs.map(doc => ({ ...doc.data(), id: doc.id }));
      return res.json(comments);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

// Comment on post
exports.commentOnPost = (req, res) => {
  if (isEmpty(req.body.body))
    return res.status(400).json({ comment: "Must not be empty" });

  const newComment = {
    body: req.body.body,
    createdAt: new Date().toISOString(),
    postId: req.params.postId,
    userHandle: req.user.handle,
    userImage: req.user.imageUrl
  };

  db.doc(`/posts/${req.params.postId}`)
    .get()
    .then(post => {
      if (!post.exists)
        return res.status(404).json({ error: "Post not found" });
      return db
        .collection("comments")
        .add(newComment)
        .then(doc => {
          newComment.id = doc.id;
          let { commentCount, commentIds } = post.data();
          commentCount++;
          commentIds.unshift(doc.id);
          return post.ref.update({
            commentCount,
            commentIds
          });
        })
        .then(() => {
          return res.json(newComment);
        })
        .catch(err => {
          console.error(err);
          return res.status(500).json({ error: err.code });
        });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

// Approve/Disapprove Post
exports.toggleApprovePost = (req, res) => {
  const postDoc = db.doc(`/posts/${req.params.postId}`);
  let postData;

  const isApprove = req.body.isApprove;

  postDoc
    .get()
    .then(doc => {
      if (doc.exists) {
        postData = doc.data();
        postData.id = doc.id;
        return db
          .collection("approves")
          .where("userHandle", "==", req.user.handle)
          .where("postId", "==", req.params.postId)
          .limit(1)
          .get();
      } else {
        return res.status(404).json({ error: "Post not found" });
      }
    })
    .then(data => {
      if ((data.empty && isApprove) || (!data.empty && !isApprove)) {
        return (isApprove
          ? db.collection("approves").add({
              postId: req.params.postId,
              userHandle: req.user.handle
            })
          : db.doc(`/approves/${data.docs[0].id}`).delete()
        )
          .then(() => {
            postData.approveCount += isApprove ? 1 : -1;
            return postDoc.update({ approveCount: postData.approveCount });
          })
          .then(() => {
            return res.json(postData);
          });
      } else {
        return res
          .status(400)
          .json({ error: `Post ${isApprove ? "already" : "not"} approved` });
      }
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

// Delete post
exports.deletePost = (req, res) => {
  const document = db.doc(`posts/${req.params.postId}`);
  document
    .get()
    .then(doc => {
      if (!doc.exists) return res.status(404).json({ error: "Post not found" });
      if (doc.data().userHandle !== req.user.handle)
        return res.status(403).json({ error: "Unauthorized" });
      else
        return document.delete().catch(err => {
          console.error(err);
          return res.status(500).json({ error: err.code });
        });
    })
    .then(() => {
      return res.json({ message: "Post deleted successfully" });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

// Delete comment
exports.deleteComment = (req, res) => {
  const userHandle = req.user.handle;
  const postId = req.body.postId;
  const commentId = req.params.commentId;

  const document = db.doc(`/comments/${commentId}`);
  document.get().then(doc => {
    if (!doc.exists)
      return res.status(404).json({ error: "Comment not found" });
    if (doc.data().userHandle !== userHandle)
      return res.status(403).json({ error: "Unauthorized" });
    else
      return document
        .delete()
        .catch(err => {
          console.error(err);
          return res.status(500).json({ error: err.code });
        })
        .then(() => {
          db.doc(`/posts/${postId}`)
            .get()
            .then(doc => {
              if (doc.exists) {
                let { commentCount, commentIds } = doc.data();

                commentCount--;
                newComments = commentIds.filter(
                  comment => comment !== commentId
                );

                return doc.ref
                  .update({ commentCount, commentIds: newComments })
                  .then(() => {
                    return res.json({
                      message: "Comment deleted successfully"
                    });
                  })
                  .catch(err => {
                    return res.status(500).json({ error: err.code });
                  });
              } else {
                return res.status(404).json({ error: "Post not found" });
              }
            })
            .catch(err => {
              console.error(err);
              return res.status(500).json({ error: err.code });
            });
        })
        .catch(err => {
          console.error(err);
          return res.status(500).json({ error: err.code });
        });
  });
};
