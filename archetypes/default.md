---
title : '{{ replace .File.ContentBaseName "-" " " | title }}'
date : {{ .Date }}
draft : true
cascade : 
    hello : world



# title: "{{ .Name | humanize | title }}"
# title: "{{ .Name | upper }}"
# weight: 1
# bookFlatSection: false
# bookToc: true
# bookHidden: false
# bookCollapseSection: false
# bookComments: false
# bookSearchExclude: false

#       cus
# sideBarCollapse: true

#       hugo source code : page__content.go#contentToC().737 line
# tocStartLevel: 2
# tocEndLevel: 5

#       debug from : hugolib/site.go:1440
#       comment of '_internal/_default/sitemap.xml'
# sitemap: { disable: true }

#       comment of 'layouts/rss.xml'
# rss: { disable: true }
---
