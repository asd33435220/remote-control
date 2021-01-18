const openAboutWindow = require('about-window').default
const path = require('path')
const create = () => {
    console.log('123');
    openAboutWindow({
        icon_path: path.join(__dirname, 'icon.png'),
        package_json_dir: path.resolve(__dirname, '../../../'),
        copyright: 'Copyright (c) 2020 zhuyuchen',
        homepage: 'https://www.baidu.com/'
    })
}
module.exports = create