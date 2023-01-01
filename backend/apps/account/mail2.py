from django.contrib.sites.shortcuts import get_current_site
from django.core.mail import EmailMultiAlternatives, get_connection
from django.template import Context, Template, engines
from django.template.context import make_context
from django.template.exceptions import TemplateDoesNotExist
from django.template.loader import get_template
from django.utils.html import strip_tags
from django.conf import settings


from django.template.context import Context

def bind_template(self, template):
    processors = (template.backend.template_context_processors +
                  self.processors)
    self.update(Context(self.dicts, processors))

Context.bind_template = bind_template
class ContextMixin:
    context = {}

    def get_context_data(self, **kwargs):
        context = {}
        context.update(self.context)
        context.update(kwargs)
        return context


class BaseEmailMessage(EmailMultiAlternatives, ContextMixin):
    _node_map = {
        "subject": "subject",
        "text_body": "body",
        "html_body": "html",
    }
    template_name = None
    request = None
    context = {}

    def __init__(self, request=None, context=None, template_name=None, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.request = request
        self.context = {} if context is None else context
        self.html = None

        if template_name is not None:
            self.template_name = template_name

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        context = dict(ctx, **self.context)

        if self.request:
            site = get_current_site(self.request)
            domain = context.get("domain") or (getattr(settings, "DOMAIN", "") or site.domain)
            protocol = context.get("protocol") or ("https" if self.request.is_secure() else "http")
            site_name = context.get("site_name") or (getattr(settings, "SITE_NAME", "") or site.name)
            user = context.get("user") or self.request.user
        else:
            domain = context.get("domain") or getattr(settings, "DOMAIN", "")
            protocol = context.get("protocol") or "http"
            site_name = context.get("site_name") or getattr(settings, "SITE_NAME", "")
            user = context.get("user")

        context.update(
            {
                "domain": domain,
                "protocol": protocol,
                "site_name": site_name,
                "user": user,
            }
        )
        return context
    def _get_template(self):
        try:
            return get_template(self.template_name)
        except TemplateDoesNotExist:
            raise ValueError(f"Template {self.template_name} does not exist")

    def render(self):
        context = make_context(self.get_context_data(), request=self.request)
        template = self._get_template()
        with context.bind_template(template):
            blocks = self._get_blocks(template.nodelist, context)
            for block_node in blocks.values():
                self._process_block(block_node, context)
        self._attach_body()

    def send(self, to, *args, **kwargs):
        self.render()

        self.to = to
        self.cc = kwargs.pop("cc", [])
        self.bcc = kwargs.pop("bcc", [])
        self.reply_to = kwargs.pop("reply_to", [])
        self.from_email = kwargs.pop("from_email", settings.DEFAULT_FROM_EMAIL)

        connection = kwargs.pop("connection", None)
        if connection is None:
            connection = get_connection(fail_silently=kwargs.pop("fail_silently", False))
        self.connection = connection

        return super().send(*args, **kwargs)


