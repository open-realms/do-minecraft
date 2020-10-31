# Final section of the user_data script after everything is installed and ready

# Start express server as a service
pm2 start /home/mcuser/express-minecraft/minecraft.js
pm2 startup
pm2 save

EOF
