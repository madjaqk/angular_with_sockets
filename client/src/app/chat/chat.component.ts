import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from "rxjs/Subscription"

import { Message } from "./message"
import { ChatService } from "./chat.service"

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  click_count: any
  user: string
  message: Message
  messages: Array<Message> = []
  subscriptions: Array<Subscription> = []

  constructor( private chat_service: ChatService, private ref: ChangeDetectorRef ) { }

  ngOnInit() {
    this.message = new Message

    let clicks_sub = this.chat_service.update_clicks()
          .subscribe(click_count => this.click_count = click_count)

    let msg_sub = this.chat_service.new_message()
          .subscribe((msg: Message) => {
            this.messages.push(msg)
            this.ref.markForCheck() // Normally, pushing into an array doesn't count as a change, so Angular doesn't update the template binding.  This overrides that default behavior.
          })

    let annoy_sub = this.chat_service.annoying()
          .subscribe(() => alert("ANNOYING POP-UP!"))

    this.subscriptions = [clicks_sub, msg_sub, annoy_sub]
  }

  button_click(){
    this.chat_service.button_click()
  }

  send_message(){
    if(!this.user){
      alert("You must enter a name to chat!")
    } else {
      this.message.user = this.user
      this.message.timestamp = new Date
      this.chat_service.send_message(this.message)
      this.message = new Message
    }
  }

  annoy(){
    this.chat_service.annoy()
  }

  ngOnDestroy(){
    this.subscriptions.forEach(sub => sub.unsubscribe())
    this.chat_service.disconnect()
  }

}
