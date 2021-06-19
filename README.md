# hexo-asset-image-cs
hexo-asset-image，image URL error，this is a resolvent

原 [hexo-asset-image](https://github.com/xcodebuild/hexo-asset-image) 对新的 hexo 图片处理路径有问题，导致部署后的图片无法展示，在此 copy 过来做了点修改；

# 使用方法:  
## hexo 项目安装该依赖，yarn add hexo-asset-image-cs
## 配置文件 _config.yml ，
```yaml
post_asset_folder: true

url: https://xxxxxx.github.io  # 自己项目的 git 仓库
```
## 将需要引用的图片存放在与文章名同名的文件夹中
```
_posts
    -image-test
        -example.png
    -image-test.md
```
在 markdown 文档中直接使用模板语法插入图片，而不是使用 markdown 语法
```markdown
{% asset_img example.png This is pic title %}
```
