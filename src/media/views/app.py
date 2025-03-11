import argparse

def main():
    # 创建参数解析器
    parser = argparse.ArgumentParser(description="处理多个参数的示例脚本")

    # 添加位置参数（必须参数）
    parser.add_argument("-i","--input_file", help="输入文件路径")

    # 添加可选参数（带默认值）
    parser.add_argument("-o", "--output", default="output.txt", 
                       help="输出文件路径（默认: output.txt）")

    # 添加整数类型参数
    parser.add_argument("-n", "--number", type=int, required=True,
                       help="必须提供的整数参数")

    # 添加多值参数（至少一个）
    parser.add_argument("--values", nargs="+", type=float,
                       help="接收多个浮点数值")

    # 添加布尔参数
    parser.add_argument("--verbose", action="store_true",
                       help="启用详细模式")

    # 解析参数
    args = parser.parse_args()

    # 使用参数的示例逻辑
    if args.verbose:
        print(f"[DEBUG] 输入文件: {args.input_file}")
        print(f"[DEBUG] 输出文件: {args.output}")
        print(f"[DEBUG] 数字参数: {args.number}")
        
    if args.values:
        total = sum(args.values)
        print(f"数值总和: {total:.2f}")

    # 这里添加实际业务逻辑
    print(f"主程序处理完成，参数已接收！")

if __name__ == "__main__":
    main()