export const Cookie = new Cookies();

function Cookies() {
  this.getCookie = function(name) {
    const matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));

    return matches ? decodeURIComponent(matches[1]) : undefined;
  }

  this.setCookie = function(name, value, newOptions = {}) {
    const options = {
      path: '/',
      'max-age': false,
      secure: false,
      samesite: 'strict',
    };

    Object.assign(options, newOptions);

    if (options.expires instanceof Date) {
      options.expires = options.expires.toUTCString();
    }

    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

    Object.keys(options).forEach(option => {
      const optionValue = options[option];

      updatedCookie += '; ' + option;
      if (optionValue) {
        updatedCookie += '=' + optionValue;
      }
    })

    document.cookie = updatedCookie;
  }

  this.deleteCookie = function(name) {
    this.setCookie(name, "", {
      'max-age': -1
    });
  }
}