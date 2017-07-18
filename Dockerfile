# Docker file for building Blender as a Python module for AWS Lambda
# Compiles to ~/blender-git/blender_build/bin
FROM amazonlinux
RUN yum install git cmake -y
RUN yum groupinstall 'Development Tools' -y

RUN mkdir ~/blender-git && \
	cd ~/blender-git && \
	git clone https://git.blender.org/blender.git && \
	cd blender && \
	git submodule update --init --recursive && \
	git submodule foreach git checkout master && \
	git submodule foreach git pull --rebase origin master

RUN yum install gcc-c++ \
	python35 python35-devel python35-libs \
	libXi-devel openexr-devel \
	freealut-devel SDL-devel fftw-devel libtiff-devel \
	freetype-devel jack-audio-connection-kit-devel \
	xvidcore-devel libogg-devel faac-devel \
	libjpeg-devel openjpeg openjpeg-devel \
	faad2-devel x264-devel libpng-devel vim \
	libGLU-devel -y

RUN git clone https://github.com/nigels-com/glew ~/glew && \
	cd ~/glew && \
	make extensions && \
	make && \
	make install

RUN mkdir ~/blender-git/blender_build && \
	cd ~/blender-git/blender_build && \
	cmake ../blender \
		-DPYTHON_INCLUDE_DIR=$(python3 -c "from distutils.sysconfig import get_python_inc; print(get_python_inc())")  \
		-DPYTHON_LIBRARY=/usr/lib64/libpython3.5m.so \
		-DPYTHON_LIBPATH=/usr/lib64 \
		-DWITH_CYCLES=OFF \
		-DWITH_AUDASPACE=OFF \
		-DWITH_BOOST=OFF \
		-DWITH_BULLET=OFF \
		-DWITH_CODEC_AVI=OFF \
		-DWITH_COMPOSITOR=OFF \
		-DWITH_COMPOSITOR=OFF \
		-DWITH_GAMEENGINE=OFF \
		-DWITH_GAMEENGINE_DECKLINK=OFF \
		-DWITH_HEADLESS=ON \
		-DWITH_IMAGE_DDS=OFF \
		-DWITH_IMAGE_CINEON=OFF \
		-DWITH_IMAGE_OPENEXR=OFF \
		-DWITH_IMAGE_OPENJPEG=OFF \
		-DWITH_IMAGE_TIFF=OFF \
		-DWITH_INPUT_NDOF=OFF \
		-DWITH_LIBMV=OFF \
		-DWITH_MOD_REMESH=OFF \
		-DWITH_MOD_SMOKE=OFF \
		-DWITH_OPENAL=OFF \
		-DWITH_OPENIMAGEIO=OFF \
		-DWITH_PYTHON_INSTALL_NUMPY=OFF \
		-DWITH_PYTHON_INSTALL_REQUESTS=OFF \
		-DWITH_PYTHON_MODULE=ON \
		-DWITH_PYTHON_INSTALL=OFF \
		-DWITH_STATIC_LIBS=ON \
		-DWITH_SYSTEM_GLEW=OFF \
		-DWITH_SYSTEM_GLES=OFF \
		-DWITH_FREESTYLE=OFF

RUN cd ~/blender-git/blender_build && \
	make && \
	make install

RUN cp -L /usr/lib64/libpython3.5m.so ~/blender-git/blender_build/bin && \
	cp -L /usr/lib64/libGLU.so.1 ~/blender-git/blender_build/bin

# -DPYTHON_LIBRARY=$(python3 -c "import distutils.sysconfig as sysconfig; print(sysconfig.get_config_var('LIBDIR') + '/' + sysconfig.get_config_var('PY3LIBRARY'))") \
# ffmpeg-libs ffmpeg-devel lame-devel libspnav-devel lame-libs  openal-soft-devel libvorbis-devel libtheora-devel 
