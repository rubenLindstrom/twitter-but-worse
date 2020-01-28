import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

// Redux
import { connect } from "react-redux";
import userActions from "../../redux/actions/userActions";

// MUI
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import Badge from "@material-ui/core/Badge";
// Icons
import NotificationsIcon from "@material-ui/icons/Notifications";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ChatIcon from "@material-ui/icons/Chat";

const Notifications = props => {
  const { notifications, markNotificationsRead } = props;
  dayjs.extend(relativeTime);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = e => {
    setAnchorEl(e.target);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const onMenuOpened = () => {
    let unreadNotificationIds = notifications
      .filter(not => !not.read)
      .map(not => not.id);
    markNotificationsRead(unreadNotificationIds);
  };

  let notificationsIcon;
  if (notifications && notifications.length > 0) {
    const numUnreadNotifications = notifications.filter(not => !not.read)
      .length;
    if (numUnreadNotifications > 0) {
      notificationsIcon = (
        <Badge badgeContent={numUnreadNotifications} color="secondary">
          <NotificationsIcon />
        </Badge>
      );
    } else {
      notificationsIcon = <NotificationsIcon />;
    }
  } else {
    notificationsIcon = <NotificationsIcon />;
  }

  let notificationsMarkup;

  if (notifications && notifications.length > 0) {
    notificationsMarkup = notifications.map(not => {
      const verb = not.type === "approve" ? "approved" : "commented on";
      const time = dayjs(not.createdAt).fromNow();
      const iconColor = not.read ? "primary" : "secondary";
      const icon =
        not.type === "approve" ? (
          <FavoriteIcon color={iconColor} style={{ marginRight: 10 }} />
        ) : (
          <ChatIcon color={iconColor} style={{ marginRight: 10 }} />
        );
      return (
        <MenuItem key={not.createdAt} onClick={handleClose}>
          {icon}
          <Typography
            component={Link}
            color="default"
            variant="body1"
            to={`/users/${not.recipient}/post/${not.postId}`}
          >
            {not.sender} {verb} your post {time}
          </Typography>
        </MenuItem>
      );
    });
  } else {
    notificationsMarkup = (
      <MenuItem onClick={handleClose}>
        You have no notifications. Yet...
      </MenuItem>
    );
  }

  return (
    <>
      <Tooltip placement="top" title="Notifications">
        <IconButton
          aria-owns={anchorEl ? "simple-menu" : undefined}
          aria-haspopup="true"
          onClick={handleOpen}
        >
          {notificationsIcon}
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        onEntered={onMenuOpened}
      >
        {notificationsMarkup}
      </Menu>
    </>
  );
};
Notifications.propTypes = {
  markNotificationsRead: PropTypes.func.isRequired,
  notifications: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  notifications: state.user.notifications
});

const mapDispatch = {
  markNotificationsRead: userActions.markNotificationsRead
};

export default connect(mapStateToProps, mapDispatch)(Notifications);
