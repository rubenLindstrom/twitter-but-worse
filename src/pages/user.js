import React, { useEffect, useState } from "react";
import withStyles from "@material-ui/core/styles/withStyles";

// Redux
import { connect } from "react-redux";
import dataActions from "../redux/actions/dataActions";

// Components
import Post from "../components/post/post";
import StaticProfile from "../components/profile/staticProfile";
import PostSkeleton from "../util/postSkeleton";
import ProfileSkeleton from "../util/profileSkeleton";

// MUI
import Grid from "@material-ui/core/Grid";

const styles = theme => ({
  ...theme.custom
});

const User = props => {
  const [profile, setProfile] = useState(null);

  const { classes, getUserData, posts, loading } = props;
  const handle = props.match.params.handle;
  const postIdParam = props.match.params.postId;

  useEffect(() => {
    getUserData(handle).then(res => {
      setProfile(res.profile);
    });

    // eslint-disable-next-line
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid item sm={8} xs={12}>
        {!loading && posts ? (
          Object.keys(posts).length !== 0 ? (
            Object.keys(posts).map(id => {
              console.log(id, postIdParam);

              return (
                <Post
                  key={id}
                  id={id}
                  post={{ ...posts[id] }}
                  openDialog={id === postIdParam}
                />
              );
            })
          ) : (
            <p className={classes.noPosts}>This user has no posts. Yet...</p>
          )
        ) : (
          <PostSkeleton />
        )}
      </Grid>
      <Grid item sm={4} xs={12}>
        {profile ? (
          <StaticProfile profile={{ ...profile }} />
        ) : (
          <ProfileSkeleton />
        )}
      </Grid>
    </Grid>
  );
};

const mapStateToProps = state => ({
  posts: state.data.posts,
  loading: state.data.loading
});

const mapDispatch = {
  getUserData: dataActions.getUserData
};

export default connect(mapStateToProps, mapDispatch)(withStyles(styles)(User));
