;(function (global, factory) {
  let hasDefine = typeof define === 'function'
  if(hasDefine) {
    define( function () {
      return factory(global)
    })
  } else {
    factory(global)
  }
})(window, function () {
  const autoplay = Symbol('autoplay'),
    findCarousel = Symbol('findCarousel'),
    move = Symbol('move'),
    getMoveInfo = Symbol('getMoveInfo'),
    triggerNames = ['carousel-slider-prev', 'carousel-slider-next', 'carousel-indicators'],
    stop = Symbol('stop'),
    autoPlayhandler = Symbol('autoPlayhandler'),
    play = Symbol('play'),
    triggerReflow = Symbol('triggerReflow'),
    transitionendHandler = Symbol('transitionendHandler')

  class Carousel {
    constructor (element, options) {
      this.options = Object.assign({
        autoPlay: true,
        interval: 1500,
        hasIndicators: true
      }, options)
      this.target = element
      this.children = element.querySelectorAll('.carousel-slider-item')
      this.options.hasIndicators && (this.indicators = element.querySelector('.carousel-indicators'))
      this.currentIndex = [].indexOf.call(this.children, element.querySelector('.carousel-slider-active'))
      this.length = this.children.length
      this.durationTransition = false

      this.options.autoPlay && this[autoplay]()
      this.target.addEventListener('transitionend', this[transitionendHandler].bind(this))
    }

    static CarouselArray = []
    static triggerNames = ['carousel-slider-prev', 'carousel-slider-next', 'indicators-li']

    static initTheCarousel(element) {
      let isInited = Carousel[findCarousel](element)
      if(isInited) {
        return 
      }
      let newCarousel = new Carousel(element)

      Carousel.CarouselArray.push(newCarousel)
    }

    static triggerMove(e) {
      let containerObj,
        target = e.target,
        containerElement = target.closest('.carousel-slider')
      if(!containerElement) {
        return 
      }
      containerObj = Carousel[findCarousel](containerElement)
      containerObj[move](target)
    }

    [transitionendHandler] () {
      if(!this.durationTransition) {
        return
      }
      this.durationTransition = false
      this.children[this.preOne].className = 'carousel-slider-item'
    }

    [autoplay]() {
      this.autoPlayTimer = setTimeout(() => {
        this[autoPlayhandler]()
      }, this.options.interval)
    }

    [autoPlayhandler]() {
      if(!this.autoPlayTimer){
        return 
      }
      let info = this[getMoveInfo]({
        className: 'carousel-slider-next',
        ele: this.target.querySelector('.carousel-slider-next')
      })
      this[play](info)
      this[autoplay]()
    }

    [move](target) {
      let names = []
      Carousel.triggerNames.forEach(className => {
        let ele = target.closest('.' + className)
        if(ele) {
          names.push({
            className,
            ele
          })
        }
      })
      if(names.length !== 1) {
        return 
      }
      let info = this[getMoveInfo](names[0])
      if(!info) {
        return 
      }
      this[stop]()
      this[play](info)
    }

    [play](info) {
      if(info.dir === undefined || info.nextOne === undefined) {
        throw new Error('no dir or nextOne')
      }
      this.durationTransition = true
      this.preOne = this.currentIndex
      if(this.indicators) {
        this.indicators.children[this.currentIndex].classList.remove('indicators-active')
        this.indicators.children[info.nextOne].classList.add('indicators-active')
      }
      if(info.dir === 'pre') {
        this.children[info.nextOne].classList.add('carousel-slider-item-pre')
        this.children[info.nextOne].classList.add('carousel-slider-active')
        Carousel[triggerReflow](this.target)
        this.children[info.nextOne].classList.remove('carousel-slider-item-pre')
        this.children[this.currentIndex].classList.add('carousel-slider-item-cur-to-pre')
      } else if (info.dir === 'next') {
        this.children[info.nextOne].classList.add('carousel-slider-item-next')
        this.children[info.nextOne].classList.add('carousel-slider-active')
        Carousel[triggerReflow](this.target)
        this.children[info.nextOne].classList.remove('carousel-slider-item-next')
        this.children[this.currentIndex].classList.add('carousel-slider-item-cur-to-next')
      }
      this.currentIndex = info.nextOne
    }

    [stop]() {
      if(this.autoPlayTimer) {
        clearTimeout(this.autoPlayTimer)
        this[autoplay]()
      }

      if(this.durationTransition) {
        // let transitionEvent = new Event('transitionend', {bubbles: true})
        // this.target.dispatchEvent(transitionEvent)
        this[transitionendHandler]()
      }
    }

    [getMoveInfo](name) {
      let dir,
        nextOne
      switch (name.className) {
        case 'carousel-slider-prev':
          dir = "pre"
          break;
        case 'carousel-slider-next' :
          dir = "next"
          break;
        case 'indicators-li':
          let parent = name.ele.parentElement
          if(!parent) {
            throw new Error("no parentElement")
          }
          nextOne = [].indexOf.call(parent.children, name.ele)
          break;
        default:
          throw new Error("no one matched")
      }
      if(nextOne === undefined) {
        nextOne = ((dir === 'pre' ? -1 : 1 )+ this.currentIndex) % this.length
        if(nextOne === -1) {
          nextOne = this.length - 1
        }
      } else {
        if(this.currentIndex > nextOne) {
          dir = 'pre'
        } else if (this.currentIndex < nextOne){
          dir = 'next'
        } else {
          return 
        }
        if(this.currentIndex === 0 && nextOne === this.length - 1) {
          dir = 'pre'
        } else if (this.currentIndex === this.length - 1 && nextOne === 0) {
          dir = 'next'
        }
      }
      return {
        dir,
        nextOne
      }
    }

    static [findCarousel](element) {
      let index =  Carousel.CarouselArray.findIndex(function (ele) {
        return ele.target === element
      })
      if(index === -1) {
        return 
      }
      return Carousel.CarouselArray[index]
    }

    static [triggerReflow](ele) {
      if(ele && ele.nodeType === 1)
        return ele.offsetHeight
    }
  }

  window.addEventListener('load', () => {
    let carousels = document.querySelectorAll('.carousel-slider')
    carousels.forEach( function (element) {
      Carousel.initTheCarousel(element)
    })
  })

  triggerNames.forEach((className) => {
    let theTriggers = document.querySelectorAll('.' + className)
    theTriggers.forEach((ele) => {
      ele.addEventListener('click', function (e) {
        Carousel.triggerMove(e)
      })
    })
  })
})