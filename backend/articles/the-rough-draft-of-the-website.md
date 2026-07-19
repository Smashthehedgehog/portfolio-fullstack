---
title: The Rough Draft of the Website
date: 2024-05-27
author: Michael Ani
teaser: My thoughts on why I started this website in the first place and my
  progress on it so far
---
When I graduated, I was trying to do anything to improve my chances of getting a job, and one thing I noticed I didn't have was a proper profile. The realization hit me when I went on my co-intern from Amdocs Tom's LinkedIn, as he graduated as well. The first thing I noticed was that he has a link to [his own website](https://robbowen.digital/), which he created from React.

Inspired by his creation, I wanted to look at multiple website portfolios that were created from scratch, avoiding the use of a template so I can hone my frontend development skills naturally. I ended up finding [this portfolio](https://www.tomkastoryano.com/) by Robb Owen, an astounding showcase of web development whih several features:

* Consideration of Accessibility.
* A multitude of pages.
* A responsive dropdown submenu.
* A layered SVG dependent on the mouse location.

From that, I decided to jump right in after looking up how to start a React app and go from there. I made a Figma account but once I envisioned how I wanted my site to look like, I just started coding without putting anything into Figma. I do think that I should have started with the Figma first but I couldn't help myself. It took a lot of Googling as well as I got stuck at a bunch of points, such as how to add animations, routers, icons, and more. Of course, that was nothing that 'npm install' couldn't fix. However, what gave me the biggest issue was the sidebar. I had trouble figuring out how to construct it. Even in it's current state, I still have issues with Accessiblity, especially when on focus:

<div class="d-flex justify-content-between gap-4 mb-2">
    <div class="d-flex flex-column align-items-center">
        <div class="picture-square d-flex align-items-center justify-content-center p-2 mb-1">
            <img src="/article-images/the-rough-draft-of-the-website/focus-expected.jpg" class="h-100" alt="Focus style example - expected" />
        </div>
        <span class="text-center newspaper-legal w-75">This is how the focus is supposed to look</span>
    </div>
    <div class="d-flex flex-column align-items-center">
        <div class="picture-square d-flex align-items-center justify-content-center p-2 mb-1">
            <img src="/article-images/the-rough-draft-of-the-website/focus-current.jpg" class="h-100" alt="Focus style example - current behaviour" />
        </div>
        <span class="text-center newspaper-legal w-75">Currently, this is how the focus looks on children</span>
    </div>
</div>

Other than that sidebar, the website creation went relatively smoothly, as I have recently completed its rough draft. Since this is entirely in frontend, I was able to host it on Github pages for $Free.99, allowing me to showcase my stuff! Unfortunately, because of my old Github username, my website is currently displayed as 'Smashthehedgehog' in the URL . . . I plan to fix that very soon.

By the time I write my next update on this website, I hope to have fixed all these issues and made this website more clean (and I'll hopefully be working by then). I ite, im out.
