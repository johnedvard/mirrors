import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';

const monetizationProgress = new BehaviorSubject(null);
export const monetize: Observable<any> = monetizationProgress.asObservable();

export const injectMonetizationTag = () => {
  const existingMetaEls: any = document.getElementsByTagName('meta');
  let existingMetaEl = null;
  if (existingMetaEls) {
    for (let el of existingMetaEls) {
      if (el && el.getAttribute('name') === 'monetization') {
        existingMetaEl = el;
      }
    }
  }

  if (existingMetaEl) {
    existingMetaEl.setAttribute('content', '$ilp.uphold.com/Wb3kd4Jf3642');
    console.log('monetization content replaced');
  } else {
    const metaEl = document.createElement('meta');
    const moneAttr = document.createAttribute('name');
    moneAttr.value = 'monetization';
    const contentAttr = document.createAttribute('content');
    contentAttr.value = '$ilp.uphold.com/Wb3kd4Jf3642';
    metaEl.setAttributeNode(moneAttr);
    metaEl.setAttributeNode(contentAttr);
    const headEl = document.getElementsByTagName('head')[0];
    headEl.appendChild(metaEl);
    console.log('monetization added');
  }

  (<any>document).monetization.addEventListener(
    'monetizationprogress',
    (ev: any) => {
      monetizationProgress.next(ev);
    }
  );
};
