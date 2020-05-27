# 设置基础镜像
FROM nginx:alpine
# 将内容复制到 /usr/share/nginx/html/ 这个目录下面
COPY jar/dist/  /usr/share/nginx/html/
COPY jar/static/bpm-ui /usr/share/nginx/bpm-ui/
#用本地的 nginx.conf 配置来替换nginx镜像里的默认配置
COPY nginx.conf /etc/nginx/nginx.conf
# nginx配置的服务器端口，默认80
EXPOSE 8700
