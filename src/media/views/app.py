import argparse

def main():
    # 创建参数解析器
    parser = argparse.ArgumentParser(description="处理多个参数的示例脚本")

    parser.add_argument("-i","--input_file", help="输入文件路径")
    parser.add_argument("-o", "--output", help="输出文件路径")
    parser.add_argument("-c", "--c2rust", help="c2rust路径")
    parser.add_argument("-b", "--bindgen", help="bingen路径")


    parser.add_argument("--show", action="store_true", help="启用详细模式")

    # 解析参数
    args = parser.parse_args()

    # 使用参数的示例逻辑
    if args.show:
        print(f"{args.input_file}")
        print(f"{args.output}")
        print(f"{args.c2rust}")
        print(f"{args.bindgen}")
        

if __name__ == "__main__":
    main()