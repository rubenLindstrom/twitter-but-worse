import React, { useEffect } from "react";
import PropTypes from "prop-types";

// Redux
import { connect } from "react-redux";
import dataActions from "../redux/actions/dataActions";

import Grid from "@material-ui/core/Grid";

import Post from "../components/post";
import Profile from "../components/profile";

const Home = props => {
  const { getPosts, loading, posts } = props;

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div>
      <Grid container spacing={4}>
        <Grid item sm={8} xs={12}>
          {loading ? (
            <p>Loading posts...</p>
          ) : (
            posts.map(post => <Post key={post.id} post={post} />)
          )}
        </Grid>
        <Grid item sm={4} xs={12}>
          <Profile />
        </Grid>
      </Grid>
    </div>
  );
};

Home.propTypes = {
  getPosts: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  posts: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  loading: state.data.loading,
  posts: state.data.posts
});

const mapDispatch = {
  getPosts: dataActions.getPosts
};

export default connect(mapStateToProps, mapDispatch)(Home);
