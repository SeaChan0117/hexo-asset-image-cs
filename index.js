'use strict';
const cheerio = require('cheerio');

// http://stackoverflow.com/questions/14480345/how-to-get-the-nth-occurrence-in-a-string
function getPosition(str, m, i) {
    return str.split(m, i).join(m).length;
}

const version = String(hexo.version).split('.');
hexo.extend.filter.register('after_post_render', function (data) {
    let beginPos;
    const config = hexo.config;
    if (config.post_asset_folder) {
        let link = data.permalink;
        if (version.length > 0 && Number(version[0]) === 3) {
            beginPos = getPosition(link, '/', 1) + 1;
        } else {
            beginPos = getPosition(link, '/', 3) + 1;
        }
        // In hexo 3.1.1, the permalink of "about" page is like ".../about/index.html".
        const endPos = link.lastIndexOf('/') + 1;
        link = link.substring(beginPos, endPos);

        const toprocess = ['excerpt', 'more', 'content'];
        for (let i = 0; i < toprocess.length; i++) {
            const key = toprocess[i];

            const $ = cheerio.load(data[key], {
                ignoreWhitespace: false,
                xmlMode: false,
                lowerCaseTags: false,
                decodeEntities: false
            });

            $('img').each(function () {
                if ($(this).attr('src')) {
                    // For windows style path, we replace '\' to '/'.
                    let src = $(this).attr('src').replace('\\', '/');
                    if (!/http[s]*.*|\/\/.*/.test(src) &&
                        !/^\s*\//.test(src)) {
                        // For "about" page, the first part of "src" can't be removed.
                        // In addition, to support multi-level local directory.
                        const linkArray = link.split('/').filter(function (elem) {
                            return elem !== '';
                        });
                        const srcArray = src.split('/').filter(function (elem) {
                            return elem !== '' && elem !== '.';
                        });
                        if (srcArray.length > 1)
                            srcArray.shift();
                        src = srcArray.join('/');
                        $(this).attr('src', config.root + link + src);
                        console.info && console.info("update link as:-->" + config.root + link + src);
                    }
                } else {
                    console.info && console.info("no src attr, skipped...");
                    console.info && console.info($(this));
                }
            });
            data[key] = $.html();
        }
    }
});

