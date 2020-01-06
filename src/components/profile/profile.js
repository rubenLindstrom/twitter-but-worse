import React, { useRef } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import withStyles from "@material-ui/core/styles/withStyles";
import dayjs from "dayjs";

// Components
import EditDetails from "./editDetails";
import MyButton from "../../util/myButton";

// Redux
import { connect } from "react-redux";
import userActions from "../../redux/actions/userActions";

// MUI
import Button from "@material-ui/core/Button";
import MuiLink from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
// Icons
import LocationOn from "@material-ui/icons/LocationOn";
import LinkIcon from "@material-ui/icons/Link";
import CalendarToday from "@material-ui/icons/CalendarToday";
import EditIcon from "@material-ui/icons/Edit";
import KeyboardReturn from "@material-ui/icons/KeyboardReturn";

const styles = theme => ({
  ...theme.custom
});

const Profile = props => {
  const fileInput = useRef(null);
  const {
    classes,
    user: {
      credentials: { handle, createdAt, imageUrl, bio, website, location },
      authenticated
    },
    loading,
    uploadImage,
    logout
  } = props;

  const handleImageChange = e => {
    const image = e.target.files[0];
    const formData = new FormData();
    formData.append("image", image, image.name);
    uploadImage(formData);
  };

  // TODO: Clear this up, break up into components?
  let profileMarkup = !loading ? (
    <Paper className={classes.paper}>
      {authenticated ? (
        <div className={classes.profile}>
          <div className="image-wrapper">
            <img src={imageUrl} alt="profile" className="profile-image" />
            <input
              type="file"
              id="imageInput"
              onChange={handleImageChange}
              hidden="hidden"
              ref={fileInput}
            />
            <MyButton
              tip="Edit profile picture"
              onClick={() => fileInput.current.click()}
              btnClassName="button"
            >
              <EditIcon color="primary" />
            </MyButton>
          </div>
          <hr />
          <div className="profile-details">
            <MuiLink
              component={Link}
              to={`/users/${handle}`}
              color="primary"
              variant="h5"
            >
              @{handle}
            </MuiLink>
            <hr />
            {bio && <Typography variant="body2">{bio}</Typography>}
            <hr />
            {location && (
              <>
                <LocationOn color="primary" />
                <span>{location}</span>
                <hr />
              </>
            )}
            {website && (
              <>
                <LinkIcon color="primary" />
                <a href={website} target="_blank" rel="noopener noreferrer">
                  {" "}
                  {website}
                </a>
                <hr />
              </>
            )}
            <CalendarToday color="primary" />{" "}
            <span>Joined {dayjs(createdAt).format("MMM YYYY")}</span>
          </div>
          <MyButton tip="Logout" onClick={logout}>
            <KeyboardReturn color="primary" />
          </MyButton>
          <EditDetails />
        </div>
      ) : (
        <>
          <Typography variant="body2" align="center">
            No profile found, please login again
          </Typography>
          <div className={classes.buttons}>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to={`/login`}
            >
              Login
            </Button>
            <Button
              variant="contained"
              color="secondary"
              component={Link}
              to={`/signup`}
            >
              Signup
            </Button>
          </div>
        </>
      )}
    </Paper>
  ) : (
    <p>Loading...</p>
  );

  return profileMarkup;
};

Profile.propTypes = {
  user: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  uploadImage: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  user: state.user,
  loading: state.user.loading
});

const mapDispatch = {
  uploadImage: userActions.uploadImage,
  logout: userActions.logout
};

export default connect(
  mapStateToProps,
  mapDispatch
)(withStyles(styles)(Profile));
