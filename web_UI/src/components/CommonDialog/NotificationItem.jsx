import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";

export default function NotificationItem({ title, notiIconColor = "info" }) {
  return (
    <ListItem alignItems="flex-start" onClick={() => {}}>
      <ListItemAvatar>
        <NotificationsIcon fontSize="large" color={notiIconColor} />
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography variant="body1" fontWeight="bold">
            {title}
          </Typography>
        }
      />
    </ListItem>
  );
}
