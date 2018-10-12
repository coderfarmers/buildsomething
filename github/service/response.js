module.exports = new class Response {
  base(code, message) { return {error: code, message}; }

  message(msg) {return this.base(0, msg);}

  error(msg) {return this.base(1, msg);}

  data(data) {
    const result = this.base(0, '请求成功');
    result.data = data;
    return result;
  }
};