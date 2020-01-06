import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

// Components
import MyButton from "../../util/myButton";
import ApproveButton from "./approveButton";
import Comments from "./comments";
import CommentForm from "./commentForm";

// Redux
import { connect } from "react-redux";
import dataActions from "../../redux/actions/dataActions";

// MUI
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
// Icons
import CloseIcon from "@material-ui/icons/Close";
import UnfoldMore from "@material-ui/icons/UnfoldMore";
import ChatIcon from "@material-ui/icons/Chat";

const styles = theme => ({
  ...theme.custom,

  profileImage: {
    maxWidth: 200,
    height: 200,
    borderRadius: "50%",
    objectFit: "cover"
  },
  dialogContent: {
    padding: 20
  },
  closeButton: {
    position: "absolute",
    left: "90%"
  },
  expandButton: {
    position: "absolute",
    left: "90%"
  },
  spinnerWrapper: {
    textAlign: "center",
    marginTop: 50,
    marginBottom: 50
  }
});

const PostDialog = props => {
  const [open, setOpen] = useState(false);

  const {
    classes,
    loading,
    getComments,
    clearErrors,
    postId,
    post: {
      body,
      userHandle,
      createdAt,
      approveCount,
      commentCount,
      comments,
      userImage
    }
  } = props;

  useEffect(() => {
    if (!comments && open) getComments(postId);
    if (!open) clearErrors();
    // eslint-disable-next-line
  }, [open]);

  const dialogMarkup = loading ? (
    <div className={classes.spinnerWrapper}>
      <CircularProgress size={175} thickness={2} color="primary" />
    </div>
  ) : (
    <Grid container spacing={5}>
      <Grid item sm={5}>
        <img src={userImage} alt="profile" className={classes.profileImage} />
      </Grid>
      <Grid item sm={7}>
        <Typography
          color="primary"
          variant="h5"
          component={Link}
          to={`/users/${userHandle}`}
        >
          @{userHandle}
        </Typography>
        <hr className={classes.invisibleSeparator} />
        <Typography variant="body2" color="textSecondary">
          {dayjs(createdAt).format("h:mm a, MMMM DD YYYY")}
        </Typography>
        <hr className={classes.invisibleSeparator} />
        <Typography variant="body1">{body}</Typography>
        <ApproveButton postId={postId} approveCount={approveCount} />
        <MyButton tip="Comments">
          <ChatIcon color="primary" />
        </MyButton>
        <span>{commentCount}</span>
      </Grid>
      <hr className={classes.visibleSeparator} />
      <CommentForm postId={postId} />
      {comments ? (
        <Comments comments={[...comments]} postId={postId} />
      ) : (
        <p>Loading comments...</p>
      )}
    </Grid>
  );

  return (
    <>
      <MyButton
        onClick={() => setOpen(true)}
        tip="Expand post"
        tipClassName={classes.expandButton}
      >
        <UnfoldMore color="primary" />
      </MyButton>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <MyButton
          tip="Close"
          onClick={() => setOpen(false)}
          tipClassName={classes.closeButton}
        >
          <CloseIcon />
        </MyButton>
        <DialogContent className={classes.dialogContent}>
          {dialogMarkup}
        </DialogContent>
      </Dialog>
    </>
  );
};

PostDialog.propTypes = {
  postId: PropTypes.string.isRequired,
  post: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  getComments: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  loading: state.ui.loading
});

const mapDispatch = {
  getComments: dataActions.getComments,
  clearErrors: dataActions.clearErrors
};

export default connect(
  mapStateToProps,
  mapDispatch
)(withStyles(styles)(PostDialog));
