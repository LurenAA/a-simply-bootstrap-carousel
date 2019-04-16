class slider {
  constructor(container, options) {
    this.slider = typeof container === 'string' ? $(container) : container
    this.pageNum = -1
    this.curPageIndex = -1
    if(!this.slider instanceof $ || !this.slider.length) {
      console.error('[slider warn]: need a string or a jquery object')
      return 
    }
    this.curPageIndex = this._getCurPageIndex()
    this.slider.on('transitionend', this.handleEvent.bind(this))
  }

  handleEvent(e){
    if(!$(e.target).hasClass('slider-active')) {
      let children = $('.slider-item')
      children.eq(this.next).removeClass('slide-move-right')
      children.eq(this.next).removeClass('cur-move-left')
      children.eq(this.next).addClass('slider-active')
      children.eq(this.curPageIndex).removeClass('slider-active')
      children.eq(this.curPageIndex).removeClass('cur-move-left')
      this.curPageIndex = this.next;
    }
  }

  _getCurPageIndex() {
    let curElement = this.slider.find('.slider-active')
    let parentArray = $.makeArray(curElement.parent().children())
    this.pageNum = parentArray.length
    return parentArray.indexOf(curElement[0])
  }

  _computeNextPage(dir) {
    let nextPage = (this.curPageIndex + dir) % this.pageNum
    return nextPage === -1 ? this.pageNum - 1 : nextPage;
  }

  _handleIndicators(next){
    let children = $('.indicators').children();
    children.eq(next).addClass('indicators-active')
    children.eq(this.curPageIndex).removeClass('indicators-active')
  }

  slide(dir) {
    let next = this._computeNextPage(dir)
    this.next = next;
    this._handleIndicators(next)
    let children = $('.slider-item')
    let delta = next - this.curPageIndex
    let direction = (delta === 1 || delta === -2) ? 'slide-move-right' : 'slide-move-left'
    children.eq(next).addClass(direction)
    let nextPos = direction === 'slide-move-right'? 'cur-move-left' : 'cur-move-right'
    children.eq(this.curPageIndex).addClass(nextPos)
    setTimeout(() => {
      children.eq(next).addClass(nextPos)
    }, 0)
  }
}

function getClickMoveDir(element) {
  return $(element).data('dir') === 'prev' ? -1 : 1;
}


// 函数处理部分

$('.slider-prev, .slider-next').on('click.slide', function () {
  let dir = getClickMoveDir(this)
  window.slider.slide(dir)
})

$(document).ready(function () {
  window.slider = new slider($('.slider').eq(0))
})

