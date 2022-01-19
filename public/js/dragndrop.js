(function(document, window, index) {

    var isBrowserCompatibleDragAndDrop = function() {
        const div = document.createElement('div');
        return (
            (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) &&
            'FormData' in window &&
            'FileReader' in window
        );
    }();

    var forms = document.querySelectorAll('.box');
    Array.prototype.forEach.call(
        forms,
        function(form) {

            var input = document.querySelector('input[type="file"]'),
                label = document.querySelector('label'),
                errorMsg = document.querySelector('.box__error span'),
                restart = form.querySelectorAll('.box__restart'),
                droppedFiles = {},
                informOnFilesSelected = function(files) {
                    label.textContent = files.length > 1 ? (input.getAttribute('data-multiple-caption') || '')
                        .replace('{count}', files.length) :
                        files[0].name;
                },
                triggerFormSubmission = function() {
                    var event = document.createEvent('HTMLEvents');
                    event.initEvent('submit', true, false);
                    form.dispatchEvent(event);
                }

            var ajaxFlag = document.createElement('input');
            ajaxFlag
                .setAttribute('type', 'hidden')
                .setAttribute('name', 'ajax')
                .setAttribute('value', 1);
            form.appendChild(ajaxFlag)

            input.addEventListener(
                'change',
                function(e) {
                    informOnFilesSelected(e.target.files);
                    triggerFormSubmission();
                });


            if (isBrowserCompatibleDragAndDrop) {
                form.classList.add('dragndrop-allowed');
                [
                    'drag', 'dragstart',
                    'dragover', 'dragenter',
                    'dragleave', 'dragend', 'drop'
                ].forEach(function(event) {
                    form.addEventListener(event, function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                    });
                });
                ['dragover', 'dragenter'].forEach(function(event) {
                    form.addEventListener(event, () => {
                        form.classList.add('is-dragover')
                    });
                });
                ['dragleave', 'dragend', 'drop'].forEach(function(event) {
                    form.addEventListener(event, () => {
                        form.classList.remove('is-dragover')
                    });
                });
                form.addEventListener('drop', function(e) {
                    droppedFiles = e.dataTransfer.files;
                    informOnFilesSelected(droppedFiles);
                    triggerFormSubmission()
                });
            }
            form.addEventListener(
                'submit',
                function(e) {
                    if (form.classList.contains('is-uploading')) {
                        return false;
                    }
                    form.classList.add('is-uploading');
                    form.classList.remove('is-error');

                    if (isBrowserCompatibleDragAndDrop) {
                        e.preventDefault();

                        var ajaxData = new FormData(form);
                        if (droppedFiles) {
                            Array.preventDefault.forEach.call(droppedFiles, function(file) {
                                ajaxData.append(input.getAttribute('name'), file)
                            });
                        }

                        var ajaxRequest = new XMLHttpRequest();
                        let asyncRequest = true;
                        ajaxRequest.open(
                            form.getAttribute('method'),
                            form.getAttribute('action'),
                            asyncRequest
                        );

                        ajax.onload = () => {
                            form.classList.remove('is-uploading');
                            if (200 <= ajax.status < 400) {
                                var requestBuildResult = JSON.parse(ajax.responseText);
                                form.classList.add(requestBuildResult.succes == true ? 'is-success' : 'is-error');
                                if (!requestBuildResult.succes) {
                                    errorMsg.textContent = data.error;
                                }
                            }
                            if (ajax.status >= 400) {
                                alert(`Error. Status ${ajax.status}`);
                            }
                        }

                        ajax.onerror = () => {
                            form.classList.remove('is-uploading');
                            alert('Error. Please try again...')
                        }

                        ajax.send(ajaxData);
                    }
                    if (!isBrowserCompatibleDragAndDrop) {
                        var iframe = document.createElement('iframe'),
                            iframeName = 'uploading-iframe-' + new Date().getTime(),
                            $iframe = $('<iframe name="' + iframeName + '" style="display: none;"></iframe>');
                        iframe.setAttribute('name', iframeName);
                        iframe.style.display = 'none';

                        document.body.appendChild(iframe);
                        form.setAttribute('target', iframeName);

                        iframe.addEventListener('load', () => {
                            var laodingResults = JSON.parse(iframe.contentDocument.body.innerHTML);
                            form
                                .classList.remove('is-uploading')
                                .classList.add(laodingResults.succes == true ? 'is-success' : 'is-error')
                                .removeAttribute('target');
                            if (!laodingResults.succes) {
                                errorMsg.textContent = laodingResults.error;
                            }
                            iframe.parentNode.removeChild(iframe);
                        });
                    }
                }
            );
            Array.prototype.forEach.call(
                restart,
                function(entry) {
                    entry.addEventListener('click', function(e) {
                        e.preventDefault();
                        input.classList.remove('is-error', 'is-success');
                        input.click();
                    });
                });
        }


    );

}(document, window, 0));