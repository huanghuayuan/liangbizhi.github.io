# makefile for deploying my blog
# make sure that we are in the branch 'source'
.PHONY: everything

everything:
	rm -rf _site/
	git add -A
	git commit -m "edit source"
	git push origin source
	jekyll build
	cp -r _site/ /tmp/
	git checkout master
	rm -rf ./*
	cp -r /tmp/_site/* .
	git add -A
	git commit -m "deploy blog"
	git push origin master
	@echo "========== 发布成功 =========="

