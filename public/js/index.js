/**
 * Copyright 2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

'use strict';

$(document).ready(function() {
  var context = '/proxy/api';
  var dialogs = [];
  var conversation = {};

  // jquery DOM nodes
  // dialog nodes
  var $dialogs = $('.dialog-container');
  var $dialogsLoading = $('.dialogs-loading');
  var $dialogsError = $('.dialogs-error');

  // conversation nodes
  var $conversationDiv = $('.conversation-div');
  var $conversation = $('.conversation-container');
  var $information = $('.information-container');
  var $profile = $('.profile-container');
  var $userInput = $('.user-input');

  /**
   * Loads the dialog-container
   */
  var getDialogs = function() {
    $dialogs.empty();
    $dialogsLoading.show();
    $dialogsError.hide();

    $.get(context + '/v1/dialogs')
    .done(function(data) {
      if (data === '')
        return;
      dialogs = data.dialogs;
      dialogs.forEach(function(dialog, index) {
        createDialogTemplate(dialog, index).appendTo($dialogs);
       });
    }).fail(function() {
      $dialogsError.show();
      $dialogsError.find('.errorMsg').html('Error getting the dialogs.');
    })
    .always(function(){
      $dialogsLoading.hide();
    });
  };
  // initial load
  getDialogs();

  var startConversation = function(index) {
    var dialog = dialogs[index];

    $conversation.empty();
    $conversationDiv.show();

    var $dialogTemplate =  $('*[data-index="'+index+'"]');
    $dialogTemplate.find('.new-dialog-container').hide();
    $dialogTemplate.find('.dialog-loading').show();

    $.post(context + '/v1/dialogs/' + dialog.dialog_id + '/conversation', {input: ''})
    .done(function(data) {
      $conversation.empty();
      $information.empty();
      $dialogTemplate.find('.new-dialog-container').show();
      $dialogTemplate.find('.dialog-loading').hide();

      // show the dialogs
      $('.dialog-selection').animate({height : '0px'}, 500, function() {
        $('.dialog-selection').hide();
        $('.dialog-selection-link').show();
        //scrollToBottom();
      });

      // save dialog, client and conversation id
      conversation.conversation_id = data.conversation_id;
      conversation.client_id = data.client_id;
      conversation.dialog_id = dialog.dialog_id;
      $('<div/>').text('Dialog name: ' + dialog.name).appendTo($information);
      $('<div/>').text('Dialog id: ' + conversation.dialog_id).appendTo($information);
      $('<div/>').text('Conversation id: ' + conversation.conversation_id).appendTo($information);
      $('<div/>').text('Client id: ' + conversation.client_id).appendTo($information);



      var text = data.response.join('&lt;br/&gt;');
      $('<p class="chat-watson"/>')
        .html($('<div/>').html(text).text())
        .appendTo($conversation);
    });
  };

  /**
   * Converse function
   */
  var conductConversation = function(){
    // service path and parameters
    var path = context + '/v1/dialogs/' + conversation.dialog_id + '/conversation';
    var params = {
      input: $userInput.val(),
      conversation_id: conversation.conversation_id,
      client_id: conversation.client_id
    };

    $userInput.val('').focus();

    $('<p class="chat-human"/>')
      .html(params.input)
      .appendTo($conversation);

    scrollToBottom();

    $.post(path, params).done(function(data) {
      var text = data.response.join('&lt;br/&gt;');
      $('<p class="chat-watson"/>')
        .html($('<div/>').html(text).text())
        .appendTo($conversation);

      getProfile();
      scrollToBottom();
    });
  };

  $('.input-btn').click(conductConversation);
  $userInput.keyup(function(event){
    if(event.keyCode === 13) {
      conductConversation();
    }
  });

  var deleteDialog = function(dialogIndex) {
    var dialog = dialogs[dialogIndex];
    if (!confirm('Are you sure you wish to delete dialog flow: ' + dialog.name)) {
      return;
    }
    var $dLoading = $('[data-index='+dialogIndex+']').find('.dialog-loading');
    var $dName = $('[data-index='+dialogIndex+']').find('.dialog-info');
    $dLoading.show();
    $dName.hide();
    $.ajax({
      type: 'DELETE',
      url: context + '/v1/dialogs/'+ dialog.dialog_id,
      dataType: 'html'
    })
    .done(function(){
      setTimeout(getDialogs, 2000);
    })
    .fail(function(){
      $dialogsError.show();
      $dialogsError.find('.errorMsg').html('Error deleting the dialogs.');
      $dName.show();
    })
    .always(function(){
      $dLoading.hide();
    });
  };

  var getProfile = function() {
    var path = context + '/v1/dialogs/' + conversation.dialog_id + '/profile';
    var params = {
      conversation_id: conversation.conversation_id,
      client_id: conversation.client_id
    };

    $.get(path, params).done(function(data) {
      $profile.empty();
      data.name_values.forEach(function(par) {
        if (par.value !== '')
          $('<div/>').text(par.name + ': ' + par.value).appendTo($profile);
      });
    });
  };

  var replaceDialog = function(dialogIndex) {
    console.log('replace dialog:' + dialogIndex);
  };

  var createDialog = function() {
    if ($('#name').val() === '' || $('#file').val() === '')
      return;

    $('#new-dialog').hide();
    $('#new-dialog-loading').show();

    $('.new-dialog-container').removeClass('selected');
    $.ajax({
      type: 'POST',
      url: context + '/v1/dialogs',
      data: new FormData($('.dialog-form')[0]),
      processData: false,
      contentType: false
    }).done(function(){
      $('.dialog-flow-title').show();
      $('.new-dialog-flow-content').hide();
      $('#new-dialog').removeClass('selected');
      $('#name').val('');
      $('#file').replaceWith($('#file').val('').clone(true));
      getDialogs();
    })
    .fail(function(){
      $dialogsError.show();
      $dialogsError.find('.errorMsg').html('Error creating the dialogs.');
    })
    .always(function(){
      $('#new-dialog-loading').hide();
      $('#new-dialog').show();
    });
  };

  $('.create-btn').click(createDialog);
  $('.dialog-form').on('submit',function(event){
    event.preventDefault() ;
  });

  var scrollToBottom = function(){
    $('body, html').animate({ scrollTop: $('body').height() + 'px' });
  };


  /**
   * show creating a new dialog flow inputs
  */
  $('#new-dialog').click(function(){
    if($('.new-dialog-flow-content').css('display') === 'none'){
      $(this).addClass('selected');
      $('.dialog-flow-title').hide();
      $('.new-dialog-flow-content').show();
    }
  });

  /**
   * Creates a DOM element that represent a dialog in the UI
   * @param  {object} dialog The dialog object {id:'' name:''}
   * @param  {int} index  the index in the dialog array
   * @return {jQuery DOM element} DOM element that represents a dialog
   */
  var createDialogTemplate = function(dialog,index) {
    var $dialogTemplate = $('.dialog-template').last().clone();

    // save the index
    $dialogTemplate.attr('data-index',index);

    // dialog name
    $dialogTemplate.find('.dialog-name-span')
      .text(dialog.name);

    $dialogTemplate.click(function(){
        $dialogTemplate.find('.dialog-loading').show();
        startConversation(index);
      });

    // edit
    $dialogTemplate.find('.edit').click(function(e){
        e.stopPropagation();
        $(this).blur();
        var url = context + '/../ui/designtool/' + dialog.dialog_id;
        window.open(url, '_blank');
    });

    // // replace
    // $dialogTemplate.find('.replace').click(function(e){
    //     e.stopPropagation();
    //     $(this).blur();
    //     replaceDialog(index);
    // });

    // delete
    $dialogTemplate.find('.delete').click(function(e){
        e.stopPropagation();
        $(this).blur();
        deleteDialog(index);
    });

    // dialog actions
    $dialogTemplate.find('.new-dialog-container')
    .hover(function(){
      $dialogTemplate.find('.dialog-links').css('visibility', 'visible');
    },function(){
      $dialogTemplate.find('.dialog-links').css('visibility', 'hidden');
    });

    return $dialogTemplate;
  };


  // show the dialogs
  $('.dialog-selection-link').click(function(){
    var self = this;
    $('.dialog-selection').animate({height : '100%'}, 0, function() {
      $('.dialog-selection').show();
      $(self).hide();
    });
  });


});
