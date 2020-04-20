const { admin, db } = require("../util/admin");
const config = require("../util/config");
const firebase = require("firebase");

firebase.initializeApp(config);

const {
  validateSignUpData,
  validateLogInData,
  reduceUserDetails
} = require("../util/validators");

// Sign up
exports.signUp = (req, res) => {
  const { email, password, confirmPassword, handle } = req.body;
  const { errors, isValid } = validateSignUpData(
    email,
    password,
    confirmPassword,
    handle
  );

  if (!isValid) return res.status(400).json(errors);

  let token, uid;
  db.doc(`/users/${handle}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        return res.status(400).json({ handle: "this handle is already taken" });
      } else {
        return firebase.auth().createUserWithEmailAndPassword(email, password);
      }
    })
    .then(data => {
      uid = data.user.uid;
      return data.user.getIdToken();
    })
    .then(idToken => {
      token = idToken;
      const userCredentials = {
        handle,
        email,
        uid,
        imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/no-avatar.png?alt=media`,
        createdAt: new Date().toISOString()
      };
      return db.doc(`/users/${handle}`).set(userCredentials);
    })
    .then(() => {
      return res.status(201).json({ token });
    })
    .catch(err => {
      console.error(err);
      if (err.code === "auth/email-already-in-use")
        return res.status(400).json({ email: "Email is already in use" });
      else {
        return res
          .status(500)
          .json({ general: "Something went wrong, please try again" });
      }
    });
};

// Log In
exports.logIn = (req, res) => {
  const { email, password } = req.body;

  const { errors, isValid } = validateLogInData(email, password);

  if (!isValid) return res.status(400).json(errors);
  else {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(data => {
        return data.user.getIdToken();
      })
      .then(token => {
        return res.json({ token });
      })
      .catch(err => {
        console.error(err);
        return res
          .status(403)
          .json({ general: "Wrong credentials, please try again" });
      });
  }
};

// Add user details
exports.addUserDetails = (req, res) => {
  const { bio, website, location } = req.body;
  let userDetails = reduceUserDetails(bio, website, location);

  db.doc(`/users/${req.user.handle}`)
    .update(userDetails)
    .then(() => {
      return res.json({ message: "Details succesfully added" });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

// Get own user details
exports.getAuthenticatedUser = (req, res) => {
  const userData = {};
  db.doc(`/users/${req.user.handle}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        userData.credentials = doc.data();
        return db
          .collection("approves")
          .where("userHandle", "==", req.user.handle)
          .get();
      } else return res.status(404).json({ errors: "User not found" });
    })
    .then(data => {
      userData.approves = [];
      data.forEach(doc => {
        userData.approves.push(doc.data());
      });
      return db
        .collection("notifications")
        .where("recipient", "==", req.user.handle)
        .orderBy("createdAt", "desc")
        .limit(10)
        .get();
    })
    .then(data => {
      userData.notifications = [];
      data.forEach(doc => {
        userData.notifications.push({
          ...doc.data(),
          id: doc.id
        });
      });
      return res.json(userData);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

// Get any user's details
exports.getUserDetails = (req, res) => {
  const userData = {};

  db.doc(`/users/${req.params.handle}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        userData.user = doc.data();
        const postRefs = userData.user.posts.map(postId =>
          db.doc(`/posts/${postId}`)
        );
        if (postRefs.length === 0) return [];
        return db.getAll(...postRefs);
      } else return res.status(404).json({ error: "User not found" });
    })
    .then(data => {
      userData.posts = {};
      data.forEach(doc => (userData.posts[doc.id] = doc.data()));
      return res.json(userData);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

// Upload image
exports.uploadImage = (req, res) => {
  const BusBoy = require("busboy");
  const path = require("path");
  const os = require("os");
  const fs = require("fs");

  const busboy = new BusBoy({ headers: req.headers });

  let imageFileName, imageToBeUploaded;

  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    if (mimetype !== "image/jpeg" && mimetype !== "image/png")
      return res.status(400).json({ error: "Wrong file type submitted" });
    const imageExtension = filename.split(".").pop();

    imageFileName = `${Math.round(Math.random() * 10000000)}.${imageExtension}`;

    const filepath = path.join(os.tmpdir(), imageFileName);

    imageToBeUploaded = { filepath, mimetype };
    file.pipe(fs.createWriteStream(filepath));
  });

  busboy.on("finish", () => {
    admin
      .storage()
      .bucket()
      .upload(imageToBeUploaded.filepath, {
        resumable: false,
        metadata: { metadata: { contentType: imageToBeUploaded.mimetype } }
      })
      .then(() => {
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
        console.log(imageFileName);

        return db.doc(`/users/${req.user.handle}`).update({ imageUrl });
      })
      .then(() => {
        return res.json({ message: "Image uploaded successfully" });
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: err.code });
      });
  });
  busboy.end(req.rawBody);
};

// Mark seen notifiations as read
exports.markNotificationsRead = (req, res) => {
  const batch = db.batch();
  req.body.forEach(notificationId => {
    const notification = db.doc(`/notifications/${notificationId}`);
    batch.update(notification, { read: true });
  });
  batch
    .commit()
    .then(() => {
      return res.json({ message: "Notifications marked as read" });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
