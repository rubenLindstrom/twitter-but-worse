import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";

// Components
import MyButton from "../../util/myButton";

// Redux
import { connect } from "react-redux";
import dataActions from "../../redux/actions/dataActions";

// MUI
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";
// Icons
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";

const styles = theme => ({
  ...theme.custom,
  closeButton: {
    position: "absolute",
    left: "91%",
    top: "3%"
  },
  button: {
    marginTop: 10
  }
});

const AddPost = props => {
  const [open, setOpen] = useState(false);
  const [body, setBody] = useState("");
  const inputRef = useRef(null);

  const { classes, loading, addPost, errors, clearErrors } = props;

  useEffect(() => {
    setBody("");
    if (Object.keys(errors).length !== 0) clearErrors();
    // eslint-disable-next-line
  }, [open, clearErrors]);

  useEffect(() => {
    inputRef.current && inputRef.current.focus();
  }, [inputRef]);

  const handleSubmit = e => {
    e.preventDefault();
    addPost({ body }).then(res => res.success && setOpen(false));
  };

  return (
    <>
      <MyButton onClick={() => setOpen(true)} tip="Add a post">
        <AddIcon />
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
        <DialogTitle>Add a new post</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              name="body"
              type="text"
              label="Body"
              multiline
              fullWidth
              rows="3"
              placeholder="What's on your mind?"
              error={errors.body ? true : false}
              helperText={errors.body}
              className={classes.textField}
              onChange={e => setBody(e.target.value)}
              ref={inputRef}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.button}
              disabled={loading}
            >
              Submit
              {loading && (
                <CircularProgress size={30} className={classes.progress} />
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

AddPost.propTypes = {
  addPost: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  loading: state.ui.loading,
  errors: state.ui.errors
});

const mapDispatch = {
  addPost: dataActions.addPost,
  clearErrors: dataActions.clearErrors
};

export default connect(
  mapStateToProps,
  mapDispatch
)(withStyles(styles)(AddPost));
