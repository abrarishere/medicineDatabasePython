tl = gsap.timeline({repeatDelay: .2});
tl.fromTo('ul li,li a , ul a', {x: -500}, {x: 0, duration: .1, stagger: 0.05})
