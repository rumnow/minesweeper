FROM nginxinc/nginx-unprivileged:1.25
RUN mkdir -p /etc/nginx/conf.d/minesweeper/
COPY ms.justmy.site.conf /etc/nginx/conf.d/
COPY index.html /etc/nginx/conf.d/minesweeper/
COPY styles.css /etc/nginx/conf.d/minesweeper/
COPY minesweeper.js /etc/nginx/conf.d/minesweeper/

CMD ["nginx", "-g", "daemon off;"]
