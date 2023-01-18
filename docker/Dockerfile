FROM nginx:latest
EXPOSE 8080

COPY configuration/nginx.conf /etc/nginx/nginx.conf
COPY configuration/nginx-security-headers.conf /etc/nginx/nginx-security-headers.conf
COPY configuration/robots.txt /usr/share/nginx/html/robots.txt
COPY dist/full-stack/  /usr/share/nginx/html
COPY dist/full-stack/assets /usr/share/nginx/html/assets
COPY version /usr/share/nginx/html/version

RUN chown -R nginx:nginx /usr/share/nginx