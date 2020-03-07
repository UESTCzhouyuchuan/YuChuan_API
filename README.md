# 项目介绍。

玉川积累的 API 接口。使用`express`框架,数据使用`mysql`存储，通过连接池提高性能，有些少量的数据使用`json`文件存储。

## emojis 接口

### 公共描述

获得你想要的[unicode](https://unicode.org)表情的基本信息。玉川把[官方网](https://unicode.org/emoji/charts/full-emoji-list.html)`emojis`表情,通过 python 把全部数据爬了出来，然后存到了数据库中，[爬虫源码](https://github.com/UESTCzhouyuchuan/pythonInternetWrom/tree/master/Emojis)。

> 对于每一个 emojis 表情，他的基本信息如下，这些信息作为数据库的列：
>
> - code，unicode 码，例如 1f499，⚠️：有的字符是由多个 unicode 码组成，多码字符中间的码使用下划线连接，例如:1f499_1f498
> - number,第几个字符
> - browser，在浏览器上的图标。
> - bighead 以及 bighead_url，输入哪一大类即其 url
> - mediumhead 以及 mediumhead_url，属于哪一细类即奇标题
> - cldr_short_name，简短的介绍信息。
> - apple，在 apple 平台的 base64 图片信息。
> - windows，在 windows 平台的 base64 图片信息
> - google,facebook,twitter,gmial,joy,sams,sb,dcm,kddi,同理。
> - andr，特殊列，比如[这个，点击查看](https://unicode.org/emoji/charts/full-emoji-list.html#1fac0)

### API 地址

<http://api.myhoney.club/emojis>

测试 demo：<http://api.myhoney.club/emojis?unicode=1f499>

### API 介绍

#### /emojis

获得传入 unicode 码的字符信息。

支持请求类型：`GET/POST`。

参数：

- unicode，必填，类型`string/array`，可以查询一个也可以多个。
- columns，选填，默认为'browser'，可以设置为'\*'获得全部数据，或者单列数据，如果需要获得某几列数据就传入一个数组。
  返回对象：

返回对象按照其 number 值进行排序，如果有人有需求后面再写。

```javascript
{
    "errMsg":"ok", // 提示信息
    "unicode_info":[] // 返回结果
}
```

#### /emojis/key

获得与关键字 key 相关的 unicode 字符，相关主要因素为 key 是否包含于字符的简介和类型中，不区分大小写。

支持请求类型：`GET/POST`。

参数：

- key，必填，类型`string`。
- columns，选填，默认为'browser'，可以设置为'\*'获得全部数据，或者单列数据，如果需要获得某几列数据就传入一个数组。
  返回对象：

返回一个数组，按照其 number 值进行排序。

```javascript
[]; // 返回结果
```

### /skin_tone_emojis 和 /skin_tone_emojis/key

和 /emojis 表情同理，唯一区别在于这是带肤色的表情。

**注**：官网区分了，所有我也区分了。

## 汉语转拼音

汉语转拼音 api。

使用的核心库`pinyin`<https://github.com/hotoo/pinyin>

demo: <http://api.myhoney.club/zh_to_pinyin?string=周玉川>

### API 介绍

#### /zh_to_pinyin 或则 /pinyin

支持请求方式： POST/GET

参数：

- string，类型 String，中文字符，必填
- heteronym，类型 Boolean，启用多音字，选填，默认 false
- segment，类型 Boolean，启用分词模式，默认 false
- style，风格，详见 <https://github.com/hotoo/pinyin#%E9%9D%99%E6%80%81%E5%B1%9E%E6%80%A7>,可选[STYLE_NORMAL,STYLE_TONE,STYLE_TONE2,STYLE_TO3NE,STYLE_INITIALS,STYLE_FIRST_LETTER]，默认值 STYLE_TONE

```
// 不带声调 STYLE_NORMAL
// 带声调这是默认风格 STYLE_TONE
// 声调作为数字放在拼音尾部 STYLE_TONE2
// 声调在注音字符之后 STYLE_TO3NE
// 只返回声母 STYLE_INITIALS
// 返回首字母 STYLE_FIRST_LETTER
```

返回值：返回转化为拼音的数组

```
{
  errMsg: '', // 提示信息
  py: [] // 返回数组
}
```

#### /pinyin/sort

按照拼音排序汉字。

参数:

- string,汉子字符
- desc,boolean,是否倒序，选填，默认 false

返回值：返回排序后的数组

```
{
  errMsg:'', // tip
  sortdZh:[], // after sortd
}
```
