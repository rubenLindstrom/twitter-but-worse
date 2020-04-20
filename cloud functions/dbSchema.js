const db = {
  posts: [
    {
      userHandle: "user",
      body: "this is the post body",
      createdAt: "2020-01-02T16:38:32.389Z",
      likeCount: 5,
      commentCount: 2
    }
  ],
  comments: [
    {
      userHandle: "user",
      postId: "oadaoijdaiodjajdjdaj",
      body: "I declare it must be so!",
      createdAt: "2020-01-02T16:38:32.389Z"
    }
  ],
  notifications: [
    {
      recipient: "user",
      sender: "john",
      read: "true | false",
      postId: "241241j414124jjklj",
      type: "like | comment",
      createdAt: "2020-01-02T16:38:32.389Z"
    }
  ]
};

const userDetails = {
  // Redux data
  credentials: {
    userId: "382U2NKWJNFWOWEIFUW3",
    email: "user@email.com",
    handle: "user",
    createdAt: "2020-01-02T16:38:32.389Z",
    imageUrl: "image/defoisfsoiefj/wsdawd",
    bio: "Pleased to meet you, noble sir or fair lady",
    website: "https://me.myself",
    location: "The fair site of York"
  },
  likes: [
    {
      userHandle: "user",
      postId: "siujoih3o5ih15o1"
    },
    {
      userHandle: "user",
      postId: "1515ij15j1i51"
    }
  ]
};
