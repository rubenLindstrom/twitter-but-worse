import React, { useState } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";

import MyButton from "../util/myButton";

// Redux
import { connect } from "react-redux";
import userActions from "../redux/actions/userActions";

// MUI
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
// Icons
import EditIcon from "@material-ui/icons/Edit";

const styles = theme => ({
  ...theme.custom,
  button: {
    float: "right"
  }
});

const EditDetails = props => {
  const {
    classes,
    editDetails,
    credentials: { bio, website, location }
  } = props;

  const initialDetailsState = {
    bio: bio || "",
    website: website || "",
    location: location || ""
  };

  const [details, setDetails] = useState(initialDetailsState);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
    setDetails(initialDetailsState);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setDetails(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = () => {
    editDetails(details);
    setOpen(false);
  };

  return (
    <>
      <MyButton
        tip="Edit details"
        onClick={handleOpen}
        btnClassName={classes.button}
      >
        <EditIcon color="primary" />
      </MyButton>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit your details</DialogTitle>
        <DialogContent>
          <form>
            <TextField
              name="bio"
              type="text"
              label="Bio"
              multiline
              rows="3"
              placeholder="A short bio about yourself..."
              className={classes.textField}
              value={details.bio}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              name="website"
              type="text"
              label="Website"
              placeholder="Your personal website..."
              className={classes.textField}
              value={details.website}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              name="location"
              type="text"
              label="Location"
              placeholder="Where you live..."
              className={classes.textField}
              value={details.location}
              onChange={handleChange}
              fullWidth
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

EditDetails.propTypes = {
  editDetails: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  credentials: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  credentials: state.user.credentials
});

const mapDispatch = {
  editDetails: userActions.editDetails
};

export default connect(
  mapStateToProps,
  mapDispatch
)(withStyles(styles)(EditDetails));
