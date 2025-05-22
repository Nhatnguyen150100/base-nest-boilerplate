/**
 * @todo Loại bỏ các trường là falsy trong obj
 * @param {Record<string, any>} params - obj được truyền vào
 * @param {Array<any>} arrayValueAccepted - mảng giá trị được chấp nhận và không muốn bỏ qua
 * @returns {Record<string, any>} - object đã loại bỏ các trường là falsy trong obj
 */
const onRemoveParams = (
  params: Record<string, any>,
  arrayValueAccepted: any[] = [],
): Record<string, any> => {
  // Chọn các giá trị được chấp nhận trong mảng truyền vào
  const onCheckAcceptedValue = (value: any): boolean => {
    if (arrayValueAccepted.length === 0) return false;
    return arrayValueAccepted.includes(value);
  };

  const handleRemoveNullUndefined = (
    obj: Record<string, any>,
  ): Record<string, any> => {
    if (!obj) return {};
    return Object.fromEntries(
      Object.entries(obj).filter(
        ([_, value]) => Boolean(value) || onCheckAcceptedValue(value),
      ),
    );
  };

  return handleRemoveNullUndefined(params);
};

export default onRemoveParams;
