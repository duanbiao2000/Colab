import argparse
import sys

from . import HTML2Text, __version__, config


def main() -> None:
    baseurl = ""

    class bcolors:
        HEADER = "\033[95m"
        OKBLUE = "\033[94m"
        OKGREEN = "\033[92m"
        WARNING = "\033[93m"
        FAIL = "\033[91m"
        ENDC = "\033[0m"
        BOLD = "\033[1m"
        UNDERLINE = "\033[4m"

    p = argparse.ArgumentParser()
    p.add_argument(
        "--default-image-alt",
        dest="default_image_alt",
        default=config.DEFAULT_IMAGE_ALT,
        help="The default alt string for images with missing ones",
    )
    p.add_argument(
        "--pad-tables",
        dest="pad_tables",
        action="store_true",
        default=config.PAD_TABLES,
        help="pad the cells to equal column width in tables",
    )
    p.add_argument(
        "--no-wrap-links",
        dest="wrap_links",
        action="store_false",
        default=config.WRAP_LINKS,
        help="don't wrap links during conversion",
    )
    p.add_argument(
        "--wrap-list-items",
        dest="wrap_list_items",
        action="store_true",
        default=config.WRAP_LIST_ITEMS,
        help="wrap list items during conversion",
    )
    p.add_argument(
        "--wrap-tables",
        dest="wrap_tables",
        action="store_true",
        default=config.WRAP_TABLES,
        help="wrap tables",
    )
    p.add_argument(
        "--ignore-emphasis",
        dest="ignore_emphasis",
        action="store_true",
        default=config.IGNORE_EMPHASIS,
        help="don't include any formatting for emphasis",
    )
    p.add_argument(
        "--reference-links",
        dest="inline_links",
        action="store_false",
        default=config.INLINE_LINKS,
        help="use reference style links instead of inline links",
    )
    p.add_argument(
        "--ignore-links",
        dest="ignore_links",
        action="store_true",
        default=config.IGNORE_ANCHORS,
        help="don't include any formatting for links",
    )
    p.add_argument(
        "--ignore-mailto-links",
        action="store_true",
        dest="ignore_mailto_links",
        default=config.IGNORE_MAILTO_LINKS,
        help="don't include mailto: links",
    )
    p.add_argument(
        "--protect-links",
        dest="protect_links",
        action="store_true",
        default=config.PROTECT_LINKS,
        help="protect links from line breaks surrounding them with angle brackets",
    )
    p.add_argument(
        "--ignore-images",
        dest="ignore_images",
        action="store_true",
        default=config.IGNORE_IMAGES,
        help="don't include any formatting for images",
    )
    p.add_argument(
        "--images-as-html",
        dest="images_as_html",
        action="store_true",
        default=config.IMAGES_AS_HTML,
        help=(
            "Always write image tags as raw html; preserves `height`, `width` and "
            "`alt` if possible."
        ),
    )
    p.add_argument(
        "--images-to-alt",
        dest="images_to_alt",
        action="store_true",
        default=config.IMAGES_TO_ALT,
        help="Discard image data, only keep alt text",
    )
    p.add_argument(
        "--images-with-size",
        dest="images_with_size",
        action="store_true",
        default=config.IMAGES_WITH_SIZE,
        help=(
            "Write image tags with height and width attrs as raw html to retain "
            "dimensions"
        ),
    )
    p.add_argument(
        "-g",
        "--google-doc",
        action="store_true",
        dest="google_doc",
        default=False,
        help="convert an html-exported Google Document",
    )
    p.add_argument(
        "-d",
        "--dash-unordered-list",
        action="store_true",
        dest="ul_style_dash",
        default=False,
        help="use a dash rather than a star for unordered list items",
    )
    p.add_argument(
        "-e",
        "--asterisk-emphasis",
        action="store_true",
        dest="em_style_asterisk",
        default=False,
        help="use an asterisk rather than an underscore for emphasized text",
    )
    p.add_argument(
        "-b",
        "--body-width",
        dest="body_width",
        type=int,
        default=config.BODY_WIDTH,
        help="number of characters per output line, 0 for no wrap",
    )
    p.add_argument(
        "-i",
        "--google-list-indent",
        dest="list_indent",
        type=int,
        default=config.GOOGLE_LIST_INDENT,
        help="number of pixels Google indents nested lists",
    )
    p.add_argument(
        "-s",
        "--hide-strikethrough",
        action="store_true",
        dest="hide_strikethrough",
        default=False,
        help="hide strike-through text. only relevant when -g is " "specified as well",
    )
    p.add_argument(
        "--escape-all",
        action="store_true",
        dest="escape_snob",
        default=False,
        help=(
            "Escape all special characters.  Output is less readable, but avoids "
            "corner case formatting issues."
        ),
    )
    p.add_argument(
        "--bypass-tables",
        action="store_true",
        dest="bypass_tables",
        default=config.BYPASS_TABLES,
        help="Format tables in HTML rather than Markdown syntax.",
    )
    p.add_argument(
        "--ignore-tables",
        action="store_true",
        dest="ignore_tables",
        default=config.IGNORE_TABLES,
        help="Ignore table-related tags (table, th, td, tr) " "while keeping rows.",
    )
    p.add_argument(
        "--single-line-break",
        action="store_true",
        dest="single_line_break",
        default=config.SINGLE_LINE_BREAK,
        help=(
            "Use a single line break after a block element rather than two line "
            "breaks. NOTE: Requires --body-width=0"
        ),
    )
    p.add_argument(
        "--unicode-snob",
        action="store_true",
        dest="unicode_snob",
        default=config.UNICODE_SNOB,
        help="Use unicode throughout document",
    )
    p.add_argument(
        "--no-automatic-links",
        action="store_false",
        dest="use_automatic_links",
        default=config.USE_AUTOMATIC_LINKS,
        help="Do not use automatic links wherever applicable",
    )
    p.add_argument(
        "--no-skip-internal-links",
        action="store_false",
        dest="skip_internal_links",
        default=config.SKIP_INTERNAL_LINKS,
        help="Do not skip internal links",
    )
    p.add_argument(
        "--links-after-para",
        action="store_true",
        dest="links_each_paragraph",
        default=config.LINKS_EACH_PARAGRAPH,
        help="Put links after each paragraph instead of document",
    )
    p.add_argument(
        "--mark-code",
        action="store_true",
        dest="mark_code",
        default=config.MARK_CODE,
        help="Mark program code blocks with [code]...[/code]",
    )
    p.add_argument(
        "--decode-errors",
        dest="decode_errors",
        default=config.DECODE_ERRORS,
        help=(
            "What to do in case of decode errors.'ignore', 'strict' and 'replace' are "
            "acceptable values"
        ),
    )
    p.add_argument(
        "--open-quote",
        dest="open_quote",
        default=config.OPEN_QUOTE,
        help="The character used to open quotes",
    )
    p.add_argument(
        "--close-quote",
        dest="close_quote",
        default=config.CLOSE_QUOTE,
        help="The character used to close quotes",
    )
    p.add_argument(
        "--version", action="version", version=".".join(map(str, __version__))
    )
    p.add_argument("filename", nargs="?")
    p.add_argument("encoding", nargs="?", default="utf-8")
    p.add_argument(
        "--include-sup-sub",
        dest="include_sup_sub",
        action="store_true",
        default=config.INCLUDE_SUP_SUB,
        help="Include the sup and sub tags",
    )
    args = p.parse_args()

    if args.filename and args.filename != "-":
        with open(args.filename, "rb") as fp:
            data = fp.read()
    else:
        data = sys.stdin.buffer.read()

    try:
        html = data.decode(args.encoding, args.decode_errors)
    except UnicodeDecodeError as err:
        warning = bcolors.WARNING + "Warning:" + bcolors.ENDC
        warning += " Use the " + bcolors.OKGREEN
        warning += "--decode-errors=ignore" + bcolors.ENDC + " flag."
        print(warning)
        raise err

    h = HTML2Text(baseurl=baseurl)
    # handle options
    if args.ul_style_dash:
        h.ul_item_mark = "-"
    if args.em_style_asterisk:
        h.emphasis_mark = "*"
        h.strong_mark = "__"

    h.body_width = args.body_width
    # 设置HTML文档的宽度
    h.google_list_indent = args.list_indent
    # 设置Google列表的缩进
    h.ignore_emphasis = args.ignore_emphasis
    # 忽略HTML中的强调标签
    h.ignore_links = args.ignore_links
    # 忽略HTML中的链接
    h.ignore_mailto_links = args.ignore_mailto_links
    # 忽略HTML中的mailto链接
    h.protect_links = args.protect_links
    # 保护HTML中的链接
    h.ignore_images = args.ignore_images
    # 忽略HTML中的图片
    h.images_as_html = args.images_as_html
    # 将HTML中的图片转换为HTML
    h.images_to_alt = args.images_to_alt
    # 将HTML中的图片转换为alt属性
    h.images_with_size = args.images_with_size
    # 将HTML中的图片转换为带有尺寸的alt属性
    h.google_doc = args.google_doc
    # 将HTML转换为Google文档
    h.hide_strikethrough = args.hide_strikethrough
    # 隐藏HTML中的删除线
    h.escape_snob = args.escape_snob
    # 转义HTML中的特殊字符
    h.bypass_tables = args.bypass_tables
    # 跳过HTML中的表格
    h.ignore_tables = args.ignore_tables
    # 忽略HTML中的表格
    h.single_line_break = args.single_line_break
    # 将HTML中的换行符转换为单行
    h.inline_links = args.inline_links
    # 将HTML中的链接转换为内联链接
    h.unicode_snob = args.unicode_snob
    # 使用Unicode字符
    h.use_automatic_links = args.use_automatic_links
    # 使用自动链接
    h.skip_internal_links = args.skip_internal_links
    # 跳过内部链接
    h.links_each_paragraph = args.links_each_paragraph
    # 每个段落都有链接
    h.mark_code = args.mark_code
    # 标记HTML中的代码
    h.wrap_links = args.wrap_links
    # 将HTML中的链接包装起来
    h.wrap_list_items = args.wrap_list_items
    # 将HTML中的列表项包装起来
    h.wrap_tables = args.wrap_tables
    # 将HTML中的表格包装起来
    h.pad_tables = args.pad_tables
    # 在HTML中的表格中添加填充
    h.default_image_alt = args.default_image_alt
    # 设置HTML中的默认图片alt属性
    h.open_quote = args.open_quote
    # 设置HTML中的开引号
    h.close_quote = args.close_quote
    # 设置HTML中的闭引号
    h.include_sup_sub = args.include_sup_sub

    sys.stdout.write(h.handle(html))
    # 处理HTML并输出结果
