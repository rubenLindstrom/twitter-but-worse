import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

// Redux
import { connect } from "react-redux";

// Components
import DeleteComment from "./deleteComment";

// MUI
import Grid from "@material-ui/core/Grid";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";

const styles = theme => ({
  ...theme.custom,
  commentsContainer: {
    paddingLeft: 10,
    paddingRight: 10
  },
  commentImage: {
    maxWidth: "100%",
    height: 100,
    objectFit: "cover",
    borderRadius: "50%"
  },
  commentData: {
    marginLeft: 20
  },
  loadingCommentsWrapper: {
    padding: 5
  }
});

const Comments = props => {
  const { classes, comments, authenticated, currentUserHandle, postId } = props;
  return (
    <Grid container className={classes.commentsContainer}>
      {comments.map((comment, index) => {
        const { body, createdAt, userImage, userHandle, id } = comment;
        return (
          <React.Fragment key={id}>
            <Grid item sm={12}>
              <Grid container style={{ position: "relative" }}>
                {authenticated && userHandle === currentUserHandle && (
                  <DeleteComment commentId={id} postId={postId} />
                )}
                <Grid item sm={2}>
                  <img
                    src={userImage}
                    alt="comment"
                    className={classes.commentImage}
                  />
                </Grid>
                <Grid item sm={9}>
                  <div className={classes.commentData}>
                    <Typography
                      variant="h5"
                      component={Link}
                      to={`/users/${userHandle}`}
                      color="primary"
                    >
                      {userHandle}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {dayjs(createdAt).format("h:mm a, MMMM DD YYYY")}
                    </Typography>
                    <hr className={classes.invisibleSeparator} />
                    <Typography variant="body1">{body}</Typography>
                  </div>
                </Grid>
              </Grid>
            </Grid>
            {index !== comments.length - 1 && (
              <hr className={classes.visibleSeparator} />
            )}
          </React.Fragment>
        );
      })}
    </Grid>
  );
};

Comments.propTypes = {
  classes: PropTypes.object.isRequired,
  comments: PropTypes.array.isRequired,
  authenticated: PropTypes.bool.isRequired,
  currentUserHandle: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  authenticated: state.user.authenticated,
  currentUserHandle: state.user.credentials.handle
});

export default connect(mapStateToProps)(withStyles(styles)(Comments));
