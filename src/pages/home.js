import React, { useEffect } from "react";
import PropTypes from "prop-types";

// Redux
import { connect } from "react-redux";
import dataActions from "../redux/actions/dataActions";

import Grid from "@material-ui/core/Grid";

import Post from "../components/post/post";
import Profile from "../components/profile/profile";

const Home = props => {
  const { getPosts, posts } = props;

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  return (
    <Grid container spacing={2}>
      <Grid item sm={8} xs={12}>
        {posts ? (
          Object.keys(posts).map(id => {
            const post = posts[id];
            return <Post key={id} id={id} post={{ ...post }} />;
          })
        ) : (
          <p>Loading posts...</p>
        )}
      </Grid>
      <Grid item sm={4} xs={12}>
        <Profile />
      </Grid>
    </Grid>
  );
};

Home.propTypes = {
  getPosts: PropTypes.func.isRequired,
  posts: PropTypes.object
};

const mapStateToProps = state => ({
  posts: state.data.posts
});

const mapDispatch = {
  getPosts: dataActions.getPosts
};

export default connect(mapStateToProps, mapDispatch)(Home);
