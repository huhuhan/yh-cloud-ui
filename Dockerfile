# 设置基础镜像
FROM nginx
# 将dist文件中的内容复制到 /usr/share/nginx/html/ 这个目录下面
COPY dist/  /usr/share/nginx/html/
#用本地的 nginx.conf 配置来替换nginx镜像里的默认配置
COPY docker/nginx.conf /etc/nginx/nginx.conf
# nginx配置的服务器端口，默认80
EXPOSE 8700
