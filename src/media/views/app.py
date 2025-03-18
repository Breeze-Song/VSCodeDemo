import argparse

        # "-e",10,
        # "-g",3,
        # "-m",llms
def main():
    # 创建参数解析器
    parser = argparse.ArgumentParser(description="处理多个参数的示例脚本")

    parser.add_argument("-i","--input_file", help="输入文件路径")
    parser.add_argument("-o", "--output", help="输出文件路径")
    parser.add_argument("-l", "--linux", help="linux")
    parser.add_argument("-b", "--bindgen", help="bingen路径")
    parser.add_argument("-e", "--e1", help="adding external dependencies")
    parser.add_argument("-g", "--g", help="LLM repairs")
    parser.add_argument("-m", "--model", help="LLM model")


    parser.add_argument("--show", action="store_true", help="启用详细模式")

    # 解析参数
    args = parser.parse_args()

    # 使用参数的示例逻辑
    if args.show:
        print(f"{args.input_file}")
        print(f"{args.output}")
        print(f"{args.linux}")
        print(f"{args.bindgen}")
        print(f"{args.e1}")
        print(f"{args.g}")
        print(f"{args.model}")        

if __name__ == "__main__":
    main()