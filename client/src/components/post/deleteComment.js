import React, { useState } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";

// Components
import MyButton from "../../util/myButton";

// Redux
import { connect } from "react-redux";
import dataActions from "../../redux/actions/dataActions";

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

const DeleteComment = props => {
  const [open, setOpen] = useState(false);
  const { classes, deleteComment, commentId, postId } = props;

  const handleDelete = () => {
    deleteComment(commentId, postId);
    setOpen(false);
  };

  return (
    <>
      <MyButton
        tip="Delete comment"
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
        <DialogTitle>Are you sure you want to delete this comment?</DialogTitle>
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

DeleteComment.propTypes = {
  classes: PropTypes.object.isRequired,
  deleteComment: PropTypes.func.isRequired,
  postId: PropTypes.string.isRequired,
  commentId: PropTypes.string.isRequired
};

const mapDispatch = {
  deleteComment: dataActions.deleteComment
};

export default connect(null, mapDispatch)(withStyles(styles)(DeleteComment));
