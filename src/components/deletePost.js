import React, { useState } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import MyButton from "../util/myButton";

// Redux
import { connect } from "react-redux";
import dataActions from "../redux/actions/dataActions";

// MUI
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
// Icons
import DeleteOutline from "@material-ui/icons/DeleteOutline";

const styles = {
  deleteButton: {
    position: "absolute",
    left: "90%",
    top: "10%"
  }
};

const DeletePost = props => {
  const [open, setOpen] = useState(false);
  const { classes, deletePost, postId } = props;

  const handleDelete = () => {
    deletePost(postId);
    setOpen(false);
  };

  return (
    <>
      <MyButton
        tip="Delete post"
        onClick={() => setOpen(!open)}
        btnClassName={classes.deleteButton}
      >
        <DeleteOutline color="secondary" />
      </MyButton>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Are you sure you want to delete this post?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

DeletePost.propTypes = {
  classes: PropTypes.object.isRequired,
  deletePost: PropTypes.func.isRequired,
  postId: PropTypes.string.isRequired
};

const mapDispatch = {
  deletePost: dataActions.deletePost
};

export default connect(null, mapDispatch)(withStyles(styles)(DeletePost));
