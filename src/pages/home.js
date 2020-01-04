import React, { useEffect, useState } from "react";
import axios from "axios";

import Grid from "@material-ui/core/Grid";

import Post from "../components/post";

const Home = () => {
  const [posts, setPosts] = useState(null);
  useEffect(() => {
    axios
      .get("/posts")
      .then(res => {
        console.log(res.data);
        setPosts(res.data);
      })
      .catch(err => console.error(err));
  }, []);

  const recentPosts = posts ? (
    posts.map(post => <Post key={post.id} post={post} />)
  ) : (
    <p>Loading posts...</p>
  );
  return (
    <div>
      <Grid container spacing={4}>
        <Grid item sm={8} xs={12}>
          {recentPosts}
        </Grid>
        <Grid item sm={4} xs={12}>
          <p>Profile</p>
        </Grid>
      </Grid>
    </div>
  );
};

export default Home;
