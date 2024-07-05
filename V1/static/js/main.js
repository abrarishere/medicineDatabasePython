tl = gsap.timeline({repeatDelay: 0.01});
tl.fromTo('ul li,li a , ul a', {x: -500}, {x: 0, duration: 0.01, stagger: 0.01})
