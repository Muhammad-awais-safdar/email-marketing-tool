<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Template;

class TemplateController extends Controller
{
    public function index()
    {
        return $this->successResponse(Template::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $template = Template::create($validated);
        return $this->successResponse($template, 'Template created successfully', 201);
    }

    public function show(Template $template)
    {
        return $this->successResponse($template);
    }

    public function update(Request $request, Template $template)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $template->update($validated);

        return $this->successResponse($template, 'Template updated successfully');
    }

    public function destroy(Template $template)
    {
        $template->delete();

        return $this->successResponse(null, 'Template deleted successfully');
    }
}
