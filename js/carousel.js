class slider {
  constructor(container, options) {
    this.slider = typeof container === 'string' ? $(container) : container
    if(!this.slider instanceof $ || !this.slider.length) {
      console.error('[slider warn]: need a string or a jquery object')
      return 
    }
    this.curPageIndex = this._getCurPageIndex()
  }

  _getCurPageIndex() {
    let curElement = this.slider.find('.slider-active')
    let parentArray = $.makeArray(curElement.parent().children())
    this.pageNum = parentArray.length
    return parentArray.indexOf(curElement[0])
  }

  _computeNextPage(dir) {
    let nextPage = (this.curPageIndex + dir) % this.pageNum
  }

  slide(dir) {
    let next = this._computeNextPage(dir)
    
    $('.indicators')
  }
}

function getClickMoveDir(element) {
  return $(element).data('dir') === 'prev' ? -1 : 1;
}

$('.slider-prev, .slider-next').on('click.slide', function () {
  let dir = getClickMoveDir(this)
  window.slider.slide(dir)
})

$(document).ready(function () {
  window.slider = new slider($('.slider').eq(0))
})

