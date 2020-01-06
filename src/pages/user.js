import React, { useEffect, useState } from "react";
import axios from "axios";
import withStyles from "@material-ui/core/styles/withStyles";

// Redux
import { connect } from "react-redux";

// Components
import Post from "../components/post/post";
import StaticProfile from "../components/profile/staticProfile";

// MUI
import Grid from "@material-ui/core/Grid";

const styles = theme => ({
  ...theme.custom
});

const User = props => {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState(null);

  const { classes } = props;

  const handle = props.match.params.handle;

  useEffect(() => {
    axios
      .get(`/user/${handle}`)
      .then(res => {
        const { user, posts } = res.data;
        setProfile(user);
        setPosts(posts);
      })
      .catch(err => console.log(err));
    // eslint-disable-next-line
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid item sm={8} xs={12}>
        {posts ? (
          Object.keys(posts).length !== 0 ? (
            Object.keys(posts).map(id => (
              <Post key={id} id={id} post={{ ...posts[id] }} />
            ))
          ) : (
            <p className={classes.noPosts}>This user has no posts. Yet...</p>
          )
        ) : (
          <p>Loading posts...</p>
        )}
      </Grid>
      <Grid item sm={4} xs={12}>
        {profile ? (
          <StaticProfile profile={profile} />
        ) : (
          <p>Loading profile...</p>
        )}
      </Grid>
    </Grid>
  );
};

const mapStateToProps = state => ({
  allPosts: state.data.posts
});

export default connect(mapStateToProps)(withStyles(styles)(User));
