import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../shared/services/translation.service';

@Component({
  selector: 'app-why-choose-us',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './why-choose-us.component.html',
  styleUrls: ['./why-choose-us.component.scss']
})
export class WhyChooseUsComponent {
  public i18n = inject(TranslationService);

  features = [
    { icon: '🛡️', titleKey: 'why.feat1Title', descKey: 'why.feat1Desc', badgeKey: 'why.feat1Badge' },
    { icon: '💰', titleKey: 'why.feat2Title', descKey: 'why.feat2Desc', badgeKey: 'why.feat2Badge' },
    { icon: '📡', titleKey: 'why.feat3Title', descKey: 'why.feat3Desc', badgeKey: 'why.feat3Badge' },
    { icon: '⏱️', titleKey: 'why.feat4Title', descKey: 'why.feat4Desc', badgeKey: 'why.feat4Badge' },
    { icon: '✨', titleKey: 'why.feat5Title', descKey: 'why.feat5Desc', badgeKey: 'why.feat5Badge' },
    { icon: '🌙', titleKey: 'why.feat6Title', descKey: 'why.feat6Desc', badgeKey: 'why.feat6Badge' }
  ];
}
